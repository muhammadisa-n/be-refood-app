import express from 'express'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'
import {
    getAllProduct,
    createProduct,
    deleteProduct,
    updateProduct,
} from '../controller/SellerController.js'
import { IsSeller } from '../middleware/RoleMiddleware.js'
const sellerRoutes = express.Router()
sellerRoutes.post('/seller/products', AuthMiddleware, IsSeller, createProduct)
sellerRoutes.get('/seller/products', AuthMiddleware, IsSeller, getAllProduct)

sellerRoutes.put(
    '/seller/products/:id',
    AuthMiddleware,
    IsSeller,
    updateProduct
)

sellerRoutes.delete(
    '/seller/products/:id',
    AuthMiddleware,
    IsSeller,
    deleteProduct
)

export default sellerRoutes
