const chalk = require('chalk');
const yargs = require('yargs');
const {isExistsSync} = require('../files-utils');

/**
 * Get this package version
 * @return {string} version number
 */
function getMyPackageName() {
    let name;
    if (!name) {
        name = require('../../package.json').name;
    }

    return name;
}

const argv = yargs
    .scriptName(getMyPackageName())
    .usage('Usage: $0 [options]')
    .option('c', {
        alias: 'config',
        string: true,
        normalize: true,
        requiresArg: true,
        description: 'JSON config file that have the connection monitor data'
    })
  .option('e', {
      alias: 'example',
      description: 'Show an example File',
      boolean: true,
      default: false
  })
  .option('d', {
      alias: 'default',
      description: 'Use the default configuration',
      boolean: true,
      default: false
  })
    .example('$0 -c connection-monitor.conf.json', 'Start monitor the connection with the data from the conf file')
    .example('$0 -d', 'This will use the default configuration for pinging Google & CloudFlare DNS and Google & Bing Domains')
    .example('$0 -e', 'Output example config file')
    .help('h')
    .alias('h', 'help')
    .check((argv) => {
        if (argv.e) {
            return true;
        }

        if(argv.d) {
            return true;
        }

        if (argv.c) {
            if (isExistsSync(argv.c)) {
                return true;
            }

            throw new Error(chalk.red('Config path doesn\'t exist'))
        }

        throw new Error('Either -c (or --config) or -d (or --default) or -e (or --example) must be provided)')
    })
    .showHelpOnFail(false, chalk.gray('Specify -h or --help for available options'))
    .argv;

module.exports = argv;
