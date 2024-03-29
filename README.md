<h1 align="center">Welcome to Connection Monitor 👋</h1>
<p>
  <a href="https://github.com/rluvaton/connection-monitor#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/rluvaton/connection-monitor/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/rluvaton/connection-monitor/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/rluvaton/connection-monitor" />
  </a>
</p>

> No more multiple terminal windows just to ping! use this CLI tool written in NodeJS for monitoring connections using ping and display it in a compact way!
### 🏠 [Homepage](https://github.com/rluvaton/connection-monitor)

## Install

```sh
npm i connection-monitor -g
```

## Features
🌟 Support Windows, Mac, and Linux (for using in Alpine run `apk add iputils`)

🌟 Print to terminal in table view for compact results

🌟 Real-time table update

## Usage

```sh
Usage: connection-monitor [options]

Options:
  --version      Show version number                                   [boolean]
  -c, --config   JSON config file that have the connection monitor data [string]
  -e, --example  Show an example File                 [boolean] [default: false]
  -d, --default  Use the default configuration        [boolean] [default: false]
  -h, --help     Show help                                             [boolean]

Examples:
  connection-monitor -c conf.json  Start monitor the connection with the data
                                   from the conf file
  connection-monitor -d            This will use the default configuration
                                   for pinging Google & CloudFlare DNS
                                   and Google & Bing Domains
  connection-monitor -e            Output example config file
```

## Config file example

```json
[
  {"name": "Google DNS", "ip": "8.8.8.8"},
  {"name": "CloudFlare DNS", "ip": "1.1.1.1"},
  {"name": "Google", "ip": "google.com"},
  {"name": "Bing", "ip": "bing.com"},
  {"name": "Home Server", "ip": "192.168.1.16", "description": "Ubuntu"}
]
```

## Author

👤 **Raz Luvaton**

* GitHub: [@rluvaton](https://github.com/rluvaton)
* LinkedIn: [@rluvaton](https://linkedin.com/in/rluvaton)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/rluvaton/connection-monitor/issues/).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Raz Luvaton](https://github.com/rluvaton). <br>
This project is [MIT](https://github.com/rluvaton/connection-monitor/blob/master/LICENSE) licensed.
