import express from 'express'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'
import {
    getUser,
    updateProfileImage,
    updateUser,
} from '../controller/UserController.js'
const userRoutes = express.Router()
userRoutes.get('/user/get', AuthMiddleware, getUser)
userRoutes.put('/user/update', AuthMiddleware, updateUser)
userRoutes.put('/user/update/profile-image', AuthMiddleware, updateProfileImage)
export default userRoutes
