const { ValidationError } = require('joi');
const errorMiddleware = (error, req, res, next) => {
    if (!error) {
        next();
        return;
    }
    if (error.name === 'ResponseError') {
        return res
            .status(error.status)
            .json({
                message: error.message,
                status_code: error.status,
            })
            .end();
    } else if (error instanceof ValidationError) {
        return res
            .status(400)
            .json({
                message: error.message,
                status_code: 400,
            })
            .end();
    } else {
        return res
            .status(500)
            .json({
                message: error.message,
                status_code: 500,
            })
            .end();
    }
};
module.exports = errorMiddleware;
