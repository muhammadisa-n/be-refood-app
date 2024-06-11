import express from 'express'
import {
    register,
    login,
    logout,
    refreshToken,
    verifyEmail,
    forgotPassword,
    verifyForgotPassword,
} from '../controller/auth-controller.js'
const authRouter = express.Router()
authRouter.post('/auth/register', register)
authRouter.post('/auth/login', login)
authRouter.delete('/auth/logout', logout)
authRouter.get('/auth/token', refreshToken)
authRouter.get('/auth/verify-email', verifyEmail)
authRouter.post('/auth/forgot-password', forgotPassword)
authRouter.post('/auth/verify-forgot-password', verifyForgotPassword)
export default authRouter
