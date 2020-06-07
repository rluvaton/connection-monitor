const chalk = require('chalk');

module.exports = () => {
    console.log(chalk.bold.underline(`Example of a config file:`), `
[
  {"name": "Router", "ip": "192.168.1.1", "comment": ""},
  {"name": "Home Server", "ip": "192.168.1.16", "comment": "description"},
  {"name": "Local", "ip": "127.0.0.1", "comment": "Local Host"}
]
`);
}
