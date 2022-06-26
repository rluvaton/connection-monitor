const Ajv = require('ajv').default;
const parseJson = require('parse-json');


module.exports = {
    validateJsonWithSchema: (schema, data) => {
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(data);
        return valid ? true : validate.errors;
    },

    parseJsonExtended: (data) => {
        return parseJson(data);
    }
}
