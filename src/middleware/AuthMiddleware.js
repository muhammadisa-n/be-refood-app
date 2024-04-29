import jwt from "jsonwebtoken"
import prisma from "../utils/prisma.js"
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["access_token"]
  const token = authHeader && authHeader.split(" ")[1]
  if (!token)
    return res.status(401).json({ msg: "Unauthorized,You must login 🔏 " })
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ msg: "Access Forbidden,Token Is Invalid or Expired 🔏 " })
    }
    req.userData = decoded
    next()
  })
}
