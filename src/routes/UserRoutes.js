import express from "express"
import { verifyToken } from "../middleware/AuthMiddleware.js"
import { getUser } from "../controller/UserController.js"
const userRoutes = express.Router()
userRoutes.get("/user/get", verifyToken, getUser)
export default userRoutes
