/**
 * Determines the type of Redis protocol parameter based on the provided data.
 * @param {string} data - The data representing a Redis protocol parameter.
 * @returns {string} - The type of the parameter ('array', 'bulk_string', 'integer', 'simple_string', 'error', or 'unknown').
 */
module.exports.parameterType = (data) => {
    let parameterType = null;

    switch (data[0]) {
        case '*':
            parameterType = 'array';
            break;
        case '$':
            parameterType = 'bulk_string';
            break;
        case ':':
            parameterType = 'integer';
            break;
        case '+':
            parameterType = 'simple_string';
            break;
        case '-':
            parameterType = 'error';
            break;
        default:
            parameterType = 'unknown';
            break;
    }

    return parameterType;
}

/**
 * Converts the Redis protocol data to the specified parameter type.
 * @param {string} data - The data to be converted.
 * @param {string} parameterType - The type to which the data should be converted ('array', 'bulk_string', 'integer', 'simple_string', 'error').
 * @returns {*} - The converted data.
 */
module.exports.convertToType = (data, parameterType) => {
    let convertedData = null;

    switch (parameterType) {
        case 'array':
            convertedData = data.split('\r\n');
            break;
        case 'bulk_string':
            convertedData = data.split('\r\n')[0];
            break;
        case 'integer':
            convertedData = Number(data.split('\r\n')[0]);
            break;
        case 'simple_string':
            convertedData = data.split('\r\n')[0];
            break;
        case 'error':
            convertedData = data.split('\r\n')[0];
            break;
        default:
            convertedData = null;
            break;
    }

    return convertedData;
}
