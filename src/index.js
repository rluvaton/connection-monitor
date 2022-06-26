const args = require('./cli');
const {example: exampleCmd, config: configCmd} = require('./commands/');

const start = async () => {
    if(args.e) {
        exampleCmd();
        return;
    }

    await configCmd(args);
}

module.exports = start
