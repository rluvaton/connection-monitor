// System library
const util = require('util');
const cp = require('child_process');
const os = require('os');
const events = require('events');
const readline = require('readline');
const isIp = require('is-ip');

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


function Ping(address, config = {}) {
    if (!isIp(address)) {
        throw new Error(`Provided address is not an IP address (${address})`)
    }

    this.pingData = new events.EventEmitter();

    this._config = config || {};
    this._address = address;
    this._addressType = isIp.version(address);
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
        }
        const spawnOptions = argumentBuilder.getSpawnOptions();
        ping = cp.spawn(pingExecutablePath, pingArgs, spawnOptions);
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

Ping.prototype._listenToPing = function(ping, parser) {
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

    const rl = readline.createInterface({input: ping.stdout});
    rl.on('line', line => {
        const lineType = parser.getLineType(line);
        parser.eat(line);

        // If still in body body
        if (lineType === 2) {
            this.pingData.emit(EVENTS.DATA, parser.getResult());
        }
    });
    rl.on('close', () => {
        this.pingData.emit(EVENTS.FINISH, {});
        this.pingData.emit(EVENTS.STATE_CHANGE, {state: STATES.FINISH});
    });
}

module.exports = {Ping, EVENTS};
