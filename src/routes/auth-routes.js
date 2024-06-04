import express from 'express'
import {
    sellerRegister,
    customerRegister,
    userLogin,
    userLogout,
    refreshToken,
    verifyEmail,
    forgotPassword,
    verifyForgotPassword,
} from '../controller/auth-controller.js'
const authRouter = express.Router()
authRouter.post('/auth/register/seller', sellerRegister)
authRouter.post('/auth/register/customer', customerRegister)
authRouter.post('/auth/login', userLogin)
authRouter.get('/auth/token', refreshToken)
authRouter.get('/auth/verify-email', verifyEmail)
authRouter.post('/auth/forgot-password', forgotPassword)
authRouter.post('/auth/verify-forgot-password', verifyForgotPassword)
authRouter.delete('/auth/logout', userLogout)
export default authRouter
