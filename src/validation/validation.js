const ResponseError = require('../utils/response-error');

const validate = (schema, data) => {
    const result = schema.validate(data);
    if (result.error) {
        throw ResponseError(`${result.error.message}`);
    }
    return result.value;
};

module.exports = validate;
