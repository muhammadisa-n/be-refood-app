import express from 'express'
import {
    register,
    login,
    logout,
    refreshToken,
    verifyEmail,
    verifyForgotPassword,
    requestForgotPassword,
} from '../controller/auth-controller.js'
import { getAllCategory } from '../controller/category-controller.js'
import {
    getAllProduct,
    getDetailProduct,
} from '../controller/product-controller.js'
const publicRoutes = express.Router()

// Auth
publicRoutes.post('/auth/register', register)
publicRoutes.post('/auth/login', login)
publicRoutes.delete('/auth/logout', logout)
publicRoutes.get('/auth/verify-email', verifyEmail)
publicRoutes.post('/auth/forgot-password', requestForgotPassword)
publicRoutes.post('/auth/verify-forgot-password', verifyForgotPassword)
publicRoutes.get('/auth/token', refreshToken)

// Product
publicRoutes.get('/products', getAllProduct)
publicRoutes.get('/products/:id', getDetailProduct)

// Category
publicRoutes.get('/categories', getAllCategory)

export default publicRoutes
