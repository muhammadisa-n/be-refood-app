import express from 'express'
import {
    Register,
    Login,
    logout,
    refreshToken,
    verifyEmail,
    forgotPassword,
    verifyForgotPassword,
} from '../controller/AuthController.js'
const authRouter = express.Router()
authRouter.post('/auth/register', Register)
authRouter.post('/auth/login', Login)
authRouter.get('/auth/token', refreshToken)
authRouter.get('/auth/verify-email', verifyEmail)
authRouter.post('/auth/forgot-password', forgotPassword)
authRouter.post('/auth/verify-forgot-password', verifyForgotPassword)
authRouter.delete('/auth/logout', logout)
export default authRouter
