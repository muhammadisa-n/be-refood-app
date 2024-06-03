import express from 'express'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'
import {
    getAllProduct,
    changeStatusProduct,
    countSeller,
    countCustomer,
    createCategory,
    deleteCategory,
    getDetailCategory,
    updateCategory,
} from '../controller/AdminController.js'
import { IsAdmin } from '../middleware/RoleMiddleware.js'
const adminRoutes = express.Router()

adminRoutes.get('/admin/products', AuthMiddleware, IsAdmin, getAllProduct)

adminRoutes.post('/admin/category', AuthMiddleware, IsAdmin, createCategory)

adminRoutes.get(
    '/admin/category/:id',
    AuthMiddleware,
    IsAdmin,
    getDetailCategory
)
adminRoutes.put('/admin/category/:id', AuthMiddleware, IsAdmin, updateCategory)
adminRoutes.delete(
    '/admin/category/:id',
    AuthMiddleware,
    IsAdmin,
    deleteCategory
)

adminRoutes.get('/admin/count-seller', AuthMiddleware, IsAdmin, countSeller)

adminRoutes.get('/admin/count-customer', AuthMiddleware, IsAdmin, countCustomer)

adminRoutes.patch(
    '/admin/products/change-status/:id',
    AuthMiddleware,
    IsAdmin,
    changeStatusProduct
)

export default adminRoutes
