const {readFile} = require('../files-utils');
const {parseJsonExtended, validateJsonWithSchema} = require('../json-utils');
const configSchema = require('../schemas/config-schema.json');
const {run} = require('../run');


async function getConfigFromFile(configPath) {
    let configFileContent;
    try {
        configFileContent = await readFile(configPath);
    } catch (e) {
        console.error('Failed reading config file', e);
        throw e;
    }

    try {
        return parseJsonExtended(configFileContent);
    } catch (error) {
        console.error('Failed parsing config file', error);
        throw error;
    }
}

module.exports = async (args) => {
    let config = [
        {name: "Google DNS", ip: "8.8.8.8"},
        {name: "CloudFlare DNS", ip: "1.1.1.1"},
        {name: "Google", ip: "google.com"},
        {name: "Bing", ip: "bing.com"}
    ];

    if(args.c) {
        try {
            config = await getConfigFromFile(args.c);
        } catch (e) {
            return false;
        }
    }

    const validationResult = validateJsonWithSchema(configSchema, config);

    if (validationResult !== true) {
        console.error('config file not matching schema', validationResult);
        return false;
    }

    // Patch for error not fully displayed
    // configJson.forEach(item => item.error = '                                                         ');

    run(config);
}
