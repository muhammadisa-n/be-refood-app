import express from "express"
import { AuthMiddleware } from "../middleware/AuthMiddleware.js"
import { IsSeller } from "../middleware/RoleMiddleware.js"
import {
  createProduct,
  deleteProduct,
  getAllProductBySellerId,
  updateProduct,
} from "../controller/ProductController.js"

const sellerRoutes = express.Router()
sellerRoutes.post("/seller/products", AuthMiddleware, IsSeller, createProduct)
sellerRoutes.get(
  "/seller/products",
  AuthMiddleware,
  IsSeller,
  getAllProductBySellerId
)
sellerRoutes.put(
  "/seller/products/:id",
  AuthMiddleware,
  IsSeller,
  updateProduct
)
sellerRoutes.delete(
  "/seller/products/:id",
  AuthMiddleware,
  IsSeller,
  deleteProduct
)
export default sellerRoutes
