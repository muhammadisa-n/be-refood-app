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
    getAllSeller,
    getAllCategory,
} from '../controller/admin-controller.js'
import { isAdmin } from '../middleware/role-middleware.js'
const adminRoutes = express.Router()

// Products
adminRoutes.get('/admin/products/count', AuthMiddleware, isAdmin, countProduct)
adminRoutes.get('/admin/products', AuthMiddleware, isAdmin, getAllProduct)
adminRoutes.patch(
    '/admin/products/:id/activate',
    AuthMiddleware,
    isAdmin,
    activateProduct
)

// Categories
adminRoutes.get('/admin/categories', AuthMiddleware, isAdmin, getAllCategory)
adminRoutes.get(
    '/admin/categories/:id',
    AuthMiddleware,
    isAdmin,
    getDetailCategory
)
adminRoutes.post('/admin/categories', AuthMiddleware, isAdmin, createCategory)
adminRoutes.put(
    '/admin/categories/:id',
    AuthMiddleware,
    isAdmin,
    updateCategory
)
adminRoutes.delete(
    '/admin/categories/:id',
    AuthMiddleware,
    isAdmin,
    deleteCategory
)

// Sellers
adminRoutes.patch(
    '/admin/sellers/:id/activate',
    AuthMiddleware,
    isAdmin,
    activateSeller
)
adminRoutes.get('/admin/sellers', AuthMiddleware, isAdmin, getAllSeller)
adminRoutes.get('/admin/sellers/count', AuthMiddleware, isAdmin, countSeller)

// Customer
adminRoutes.get(
    '/admin/customers/count',
    AuthMiddleware,
    isAdmin,
    countCustomer
)

export default adminRoutes
