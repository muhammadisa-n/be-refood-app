import express from 'express'
import {
    deleteCart,
    createCart,
    getAllCart,
} from '../controller/cart-controller.js'
import { AuthMiddleware } from '../middleware/auth-middleware.js'
import { isCustomer } from '../middleware/role-middleware.js'
const cartRoutes = express.Router()

cartRoutes.get('/cart', AuthMiddleware, isCustomer, getAllCart)
cartRoutes.post('/cart', AuthMiddleware, isCustomer, createCart)
cartRoutes.delete('/cart/:id', AuthMiddleware, isCustomer, deleteCart)

export default cartRoutes
