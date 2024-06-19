import express from 'express'
import { AuthMiddleware } from '../middleware/auth-middleware.js'
import {
    getAllProduct,
    countSeller,
    countCustomer,
    countProduct,
    createCategory,
    deleteCategory,
    updateCategory,
    getDetailCategory,
    activateProduct,
    activateSeller,
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

adminRoutes.get('/admin/count-sellers', AuthMiddleware, isAdmin, countSeller)

adminRoutes.get(
    '/admin/count-customers',
    AuthMiddleware,
    isAdmin,
    countCustomer
)
adminRoutes.get('/admin/count-products', AuthMiddleware, isAdmin, countProduct)
adminRoutes.get(
    '/admin/category/:id',
    AuthMiddleware,
    isAdmin,
    getDetailCategory
)

adminRoutes.patch(
    '/admin/activate/products/:id',
    AuthMiddleware,
    isAdmin,
    activateProduct
)
adminRoutes.patch(
    '/admin/activate/seller/:id',
    AuthMiddleware,
    isAdmin,
    activateSeller
)

export default adminRoutes
