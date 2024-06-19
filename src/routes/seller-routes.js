import express from 'express'
import { AuthMiddleware } from '../middleware/auth-middleware.js'
import {
    getAllProduct,
    createProduct,
    deleteProduct,
    updateProduct,
    countProduct,
    verifySeller,
} from '../controller/seller-controller.js'
import { isSeller } from '../middleware/role-middleware.js'

const sellerRoutes = express.Router()
sellerRoutes.post('/seller/products', AuthMiddleware, isSeller, createProduct)
sellerRoutes.post('/seller/activate', AuthMiddleware, isSeller, verifySeller)
sellerRoutes.get('/seller/products', AuthMiddleware, isSeller, getAllProduct)
sellerRoutes.get(
    '/seller/products/count',
    AuthMiddleware,
    isSeller,
    countProduct
)

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
