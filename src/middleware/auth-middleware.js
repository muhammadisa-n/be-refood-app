const jwt = require('jsonwebtoken');
const AuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({
            message: 'Unauthorized, Access Token Tidak Ada',
            status_code: 401,
        });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
        if (err) {
            return res.status(401).json({
                message: 'Unauthorized, Token Tidak Valid Atau Kadaluarsa',
                status_code: 401,
            });
        }
        req.userData = decodedData;
        next();
    });
};

module.exports = { AuthMiddleware };
