import express from 'express'
import {
    deleteCart,
    createCart,
    getAllCart,
} from '../controller/CartController.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'
import { IsCustomer } from '../middleware/RoleMiddleware.js'
const cartRoutes = express.Router()

cartRoutes.get('/cart', AuthMiddleware, IsCustomer, getAllCart)
cartRoutes.post('/cart', AuthMiddleware, IsCustomer, createCart)
cartRoutes.delete('/cart/:id', AuthMiddleware, IsCustomer, deleteCart)

export default cartRoutes
