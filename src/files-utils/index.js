const fs = require("fs");

module.exports = {
    readFile: (path) => {
        return new Promise((resolve, reject) =>
            fs.readFile(path, (err, data) => err ? reject(err) : resolve(data))
        );
    },
    isExistsSync: (path) => fs.existsSync(path)
}
