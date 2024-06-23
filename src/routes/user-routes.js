import express from 'express'
import { AuthMiddleware } from '../middleware/auth-middleware.js'
import { getUser, updateUser } from '../controller/user-controller.js'
const userRoutes = express.Router()
userRoutes.get('/users/get', AuthMiddleware, getUser)
userRoutes.put('/users/update', AuthMiddleware, updateUser)
export default userRoutes
