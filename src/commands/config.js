const {readFile} = require('../files-utils');
const {parseJsonExtended, validateJsonWithSchema} = require('../json-utils');
const configSchema = require('../schemas/config-schema.json');
const {run} = require('../run');

module.exports = async (args) => {
    const configPath = args.c;

    let configFileContent;
    try {
        configFileContent = await readFile(configPath);
    } catch (e) {
        console.error('Failed reading config file', e);
        return false;
    }

    let configJson;

    try {
        configJson = parseJsonExtended(configFileContent);
    } catch (error) {
        console.error('Failed parsing config file', error);
        return false;
    }

    const validationResult = validateJsonWithSchema(configSchema, configJson);

    if (validationResult !== true) {
        console.error('config file not matching schema', validationResult);
        return false;
    }

    // Patch for error not fully displayed
    // configJson.forEach(item => item.error = '                                                         ');

    run(configJson);
}
