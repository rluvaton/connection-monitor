const args = require('./cli');
const {example: exampleCmd, commands: configCmd} = require('./commands/');

const start = async () => {
    if(args.e) {
        exampleCmd();
        return;
    }

    if(args.c) {
        await configCmd(args);
        return;
    }
}


module.exports = start
