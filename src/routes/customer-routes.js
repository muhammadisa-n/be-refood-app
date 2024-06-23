import express from 'express'
import {
    deleteCart,
    createCart,
    getAllCart,
    createOrder,
} from '../controller/customer-controller.js'
import { AuthMiddleware } from '../middleware/auth-middleware.js'
import { isCustomer } from '../middleware/role-middleware.js'
const customerRoutes = express.Router()

customerRoutes.get('/customer/carts', AuthMiddleware, isCustomer, getAllCart)
customerRoutes.post('/customer/carts', AuthMiddleware, isCustomer, createCart)
customerRoutes.post('/customer/orders', AuthMiddleware, isCustomer, createOrder)
customerRoutes.delete(
    '/customer/carts/:id',
    AuthMiddleware,
    isCustomer,
    deleteCart
)

export default customerRoutes
