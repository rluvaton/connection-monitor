const chalk = require('chalk');

module.exports = () => {
    console.log(chalk.bold.underline(`Example of a config file:`), `
[
  {"name": "Google DNS", "ip": "8.8.8.8"},
  {"name": "CloudFlare DNS", "ip": "1.1.1.1"},
  {"name": "Google", "ip": "google.com"},
  {"name": "Bing", "ip": "bing.com"},
  {"name": "Home Server", "ip": "192.168.1.16", "description": "Ubuntu"}
]
`);
}
