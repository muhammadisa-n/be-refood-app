import express from "express"
import { AuthMiddleware } from "../middleware/AuthMiddleware.js"
import { getUser, updateUser } from "../controller/UserController.js"
const userRoutes = express.Router()
userRoutes.get("/user/get", AuthMiddleware, getUser)
userRoutes.put("/user/update", AuthMiddleware, updateUser)
export default userRoutes
