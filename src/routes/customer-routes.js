import express from 'express'
import {
    deleteCart,
    createCart,
    getAllCart,
} from '../controller/customer-controller.js'
import { AuthMiddleware } from '../middleware/auth-middleware.js'
import { isCustomer } from '../middleware/role-middleware.js'
const customerRoutes = express.Router()

customerRoutes.get('/customer/cart', AuthMiddleware, isCustomer, getAllCart)
customerRoutes.post('/customer/cart', AuthMiddleware, isCustomer, createCart)
customerRoutes.delete(
    '/customer/cart/:id',
    AuthMiddleware,
    isCustomer,
    deleteCart
)

export default customerRoutes
