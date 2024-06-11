import express from 'express'
import { AuthMiddleware } from '../middleware/auth-middleware.js'
import {
    getAllProduct,
    createProduct,
    deleteProduct,
    updateProduct,
} from '../controller/seller-controller.js'
import { isSeller } from '../middleware/role-middleware.js'

const sellerRoutes = express.Router()
sellerRoutes.post('/seller/products', AuthMiddleware, isSeller, createProduct)
sellerRoutes.get('/seller/products', AuthMiddleware, isSeller, getAllProduct)

sellerRoutes.put(
    '/seller/products/:id',
    AuthMiddleware,
    isSeller,
    updateProduct
)

sellerRoutes.delete(
    '/seller/products/:id',
    AuthMiddleware,
    isSeller,
    deleteProduct
)

export default sellerRoutes
