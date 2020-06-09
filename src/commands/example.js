const chalk = require('chalk');

module.exports = () => {
    console.log(chalk.bold.underline(`Example of a config file:`), `
[
  {"name": "Router", "ip": "192.168.1.1"},
  {"name": "Home Server", "ip": "192.168.1.16", "description": "Ubuntu"},
  {"name": "Local", "ip": "127.0.0.1", "description": "Local Host"}
]
`);
}
