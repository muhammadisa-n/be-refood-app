import express from 'express'
import { AuthMiddleware } from '../middleware/auth-middleware.js'
import { getUser, updateUser } from '../controller/user-controller.js'
const userRoutes = express.Router()
userRoutes.get('/user/get', AuthMiddleware, getUser)
userRoutes.put('/user/update', AuthMiddleware, updateUser)
export default userRoutes
