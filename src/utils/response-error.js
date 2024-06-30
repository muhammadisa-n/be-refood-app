const ResponseError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    error.name = 'ResponseError';
    return error;
};

module.exports = ResponseError;
