import jwt from 'jsonwebtoken'
export const AuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token === null)
        return res
            .status(401)
            .json({
                message: 'Unauthorized,You must login 🔏 ',
                status_code: 401,
            })
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
        if (err) {
            return res.status(403).json({
                message: 'Access Forbidden,Token Is Invalid or Expired 🔏 ',
                status_code: 403,
            })
        }
        req.userData = decodedData
        next()
    })
}
