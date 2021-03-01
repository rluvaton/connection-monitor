// System library
const util = require('util');
const cp = require('child_process');
const os = require('os');
const events = require('events');
const readline = require('readline');
const isIp = require('is-ip');
const isValidHostname = require('is-valid-hostname')

// ping library
const builderFactory = require('ping/lib/builder/factory');
const parserFactory = require('ping/lib/parser/factory');

const STATES = {
    LOADING: 'loading',
    PROCESSING: 'processing',
    FINISH: 'finish',
    EXIT: 'exit',
    ERROR: 'error'
}
const EVENTS = {
    STATE_CHANGE: 'state-change',
    DATA: 'data',
    FINISH: 'finish',
    EXIT: 'exit',
    ERROR: 'error'
}

let isSystemUsingPingFromIputils;

function doesSystemUsePingFromIputils() {
    if (isSystemUsingPingFromIputils === undefined) {
        const output = cp.execSync('ping -V').toString();

        isSystemUsingPingFromIputils = output.startsWith('ping utility, iputils');
    }

    return isSystemUsingPingFromIputils;
}

function Ping(address, config = {}) {
    if (!isValidHostname(address)) {
        throw new Error(`Provided address is not a valid hostname (${address})`)
    }

    this.pingData = new events.EventEmitter();

    this._config = config || {};
    this._address = address;
    this._addressType = isIp(address) ? isIp.version(address) : 4;
}

Ping.prototype.run = function () {
    this.pingData.emit(EVENTS.LOADING);
    this.pingData.emit(EVENTS.STATE_CHANGE, {state: STATES.LOADING});

    // Spawn a ping process
    let ping = null;
    const platform = os.platform();
    try {
        const argumentBuilder = builderFactory.createBuilder(platform);
        const pingExecutablePath = builderFactory.getExecutablePath(platform, this._addressType === 6);

        const pingArgs = [this._address];
        if (builderFactory.isWindow(platform)) {
            // To make it without limit
            pingArgs.push('-t');
        } else {

            // Some distros use the `ping` from `inetutils` that doesn't have the `-O` flag.
            // Therefore couldn't get updates when a ping face some issues (_Destination Host Unreachable_ and etc...) #52
            //
            // Alpine (BusyBox) implementation of ping don't have this flag by default
            // So Alpine users need to install the `iputils` package in order of this package to work
            if (doesSystemUsePingFromIputils()) {
                pingArgs.push('-O');
            }
        }
        const spawnOptions = argumentBuilder.getSpawnOptions();
        ping = cp.spawn(pingExecutablePath, pingArgs, spawnOptions);
        ping.stdout.on('data', (data) => console.log('>', data.toString()));
    } catch (err) {
        this.pingData.emit(EVENTS.STATE_CHANGE, {state: STATES.ERROR, payload: err});
        this.pingData.emit(EVENTS.ERROR, err);
        throw err;
    }

    this.pingData.emit(EVENTS.STATE_CHANGE, {state: STATES.PROCESSING});

    // Initial parser
    const parser = parserFactory.createParser(platform, this._config);

    this._listenToPing(ping, parser);

    return () => ping.kill('SIGINT');
}

Ping.prototype._listenToPing = function (ping, parser) {
    ping.once('error', () => {
        const err = new Error(
            util.format(
                'ping.probe: %s. %s',
                'there was an error while executing the ping program. ',
                'Check the path or permissions...'
            )
        );
        this.pingData.emit(EVENTS.STATE_CHANGE, {state: STATES.ERROR, payload: err});
        this.pingData.emit(EVENTS.ERROR, err);
    });

    const rl = readline.createInterface(); // {input: ping.stdout}
    rl.on('line', line => {
        const lineType = parser.getLineType(line);
        parser.eat(line);

        // If still in body body
        if (lineType === 2) {
            const result = parser.getResult();
            this.pingData.emit(EVENTS.DATA, result);
        }
    });
    rl.on('close', () => {
        this.pingData.emit(EVENTS.FINISH, {});
        this.pingData.emit(EVENTS.STATE_CHANGE, {state: STATES.FINISH});
    });
}

module.exports = {Ping, EVENTS};
