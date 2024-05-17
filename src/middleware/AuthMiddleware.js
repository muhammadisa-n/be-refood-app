import jwt from "jsonwebtoken"
export const AuthMiddleware = async (req, res, next) => {
  const token = req.cookies.auth_token
  if (!token)
    return res.status(401).json({ msg: "Unauthorized,You must login 🔏 " })
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
    if (err) {
      return res
        .status(403)
        .json({ msg: "Access Forbidden,Token Is Invalid or Expired 🔏 " })
    }
    req.userData = data
    next()
  })
}
