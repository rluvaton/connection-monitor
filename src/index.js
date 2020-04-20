const {Ping, EVENTS} = require('./ping/');


const ip = '192.168.1.1';
const target = new Ping(ip);

target.pingData.on(EVENTS.DATA, ({isAlive, time, error}) => {
    console.log(isAlive, isAlive ? `time took is ${time}ms` : `Error ${JSON.stringify(error)}`)
});

target.pingData.on(EVENTS.ERROR, (err) => {
    console.error('error for ip', {ip, err})
});

target.run();
