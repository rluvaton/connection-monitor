const args = require('./cli');
const exampleCmd = require('./commands/example');
const configCmd = require('./commands/config');

const start = async () => {
    if(args.e) {
        exampleCmd(args);
        return;
    }

    if(args.c) {
        await configCmd(args);
        return;
    }

    // run([
    //     {name: 'Router', ip: '192.168.1.1', isAlive: false, error: '                                                      '},
    //     {name: 'Home Server', ip: '192.168.1.16', isAlive: false, description: 'Ubuntu', error: '                                                      '},
    //     {name: 'Local', ip: '127.0.0.1', isAlive: false, description: 'Local Host', error: '                                                      '},
    // ]);
}


module.exports = start
