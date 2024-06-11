import express from 'express'
import { AuthMiddleware } from '../middleware/auth-middleware.js'
import {
    getAllProduct,
    changeStatusProduct,
    countSeller,
    countCustomer,
    createCategory,
    deleteCategory,
    updateCategory,
    getDetailCategory,
} from '../controller/admin-controller.js'
import { isAdmin } from '../middleware/role-middleware.js'
const adminRoutes = express.Router()

adminRoutes.get('/admin/products', AuthMiddleware, isAdmin, getAllProduct)

adminRoutes.post('/admin/category', AuthMiddleware, isAdmin, createCategory)

adminRoutes.put('/admin/category/:id', AuthMiddleware, isAdmin, updateCategory)
adminRoutes.delete(
    '/admin/category/:id',
    AuthMiddleware,
    isAdmin,
    deleteCategory
)

adminRoutes.get('/admin/count-seller', AuthMiddleware, isAdmin, countSeller)

adminRoutes.get('/admin/count-customer', AuthMiddleware, isAdmin, countCustomer)
adminRoutes.get(
    '/admin/category/:id',
    AuthMiddleware,
    isAdmin,
    getDetailCategory
)

adminRoutes.patch(
    '/admin/products/change-status/:id',
    AuthMiddleware,
    isAdmin,
    changeStatusProduct
)

export default adminRoutes
