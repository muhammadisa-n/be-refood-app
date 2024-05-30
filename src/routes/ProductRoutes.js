import express from 'express'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'
import {
    getAllProduct,
    getDetailProduct,
} from '../controller/ProductController.js'

const productRoutes = express.Router()
productRoutes.get('/products', getAllProduct)
productRoutes.get('/products/:id', getDetailProduct)

export default productRoutes
