import express from 'express'
import {
    Register,
    Login,
    logout,
    refreshToken,
    verifyEmail,
} from '../controller/AuthController.js'
const authRouter = express.Router()
authRouter.post('/auth/register', Register)
authRouter.post('/auth/login', Login)
authRouter.get('/auth/token', refreshToken)
authRouter.get('/auth/verify-email', verifyEmail)
authRouter.delete('/auth/logout', logout)
export default authRouter
