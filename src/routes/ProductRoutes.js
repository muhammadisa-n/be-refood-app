import express from "express"
import { AuthMiddleware } from "../middleware/AuthMiddleware.js"
import {
  getAllProduct,
  getDetailProduct,
} from "../controller/ProductController.js"

const productRoutes = express.Router()
productRoutes.get("/products", AuthMiddleware, getAllProduct)
productRoutes.get("/products/:id", AuthMiddleware, getDetailProduct)

export default productRoutes
