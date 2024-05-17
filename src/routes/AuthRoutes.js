import express from "express"
import { Register, Login, logout } from "../controller/AuthController.js"
import { AuthMiddleware } from "../middleware/AuthMiddleware.js"
const authRouter = express.Router()
authRouter.post("/auth/register", Register)
authRouter.post("/auth/login", Login)
authRouter.delete("/auth/logout", AuthMiddleware, logout)
export default authRouter
