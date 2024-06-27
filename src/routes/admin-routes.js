const express = require('express');
const { AuthMiddleware } = require('../middleware/auth-middleware.js');
const {
    getAllProduct,
    getDetailProduct,
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
    getAllCustomer,
} = require('../controller/admin-controller.js');
const { isAdmin } = require('../middleware/role-middleware.js');

const adminRoutes = express.Router();
// Products
adminRoutes.get('/admin/products', AuthMiddleware, isAdmin, getAllProduct);
adminRoutes.get(
    '/admin/products/:id',
    AuthMiddleware,
    isAdmin,
    getDetailProduct
);
adminRoutes.get('/admin/products/count', AuthMiddleware, isAdmin, countProduct);
adminRoutes.patch(
    '/admin/products/:id/activate',
    AuthMiddleware,
    isAdmin,
    activateProduct
);

// Categories
adminRoutes.get('/admin/categories', AuthMiddleware, isAdmin, getAllCategory);
adminRoutes.get(
    '/admin/categories/:id',
    AuthMiddleware,
    isAdmin,
    getDetailCategory
);
adminRoutes.post('/admin/categories', AuthMiddleware, isAdmin, createCategory);
adminRoutes.put(
    '/admin/categories/:id',
    AuthMiddleware,
    isAdmin,
    updateCategory
);
adminRoutes.delete(
    '/admin/categories/:id',
    AuthMiddleware,
    isAdmin,
    deleteCategory
);

// Sellers
adminRoutes.patch(
    '/admin/sellers/:id/activate',
    AuthMiddleware,
    isAdmin,
    activateSeller
);
adminRoutes.get('/admin/sellers', AuthMiddleware, isAdmin, getAllSeller);
adminRoutes.get('/admin/sellers/count', AuthMiddleware, isAdmin, countSeller);

// Customer
adminRoutes.get('/admin/customers', AuthMiddleware, isAdmin, getAllCustomer);
adminRoutes.get(
    '/admin/customers/count',
    AuthMiddleware,
    isAdmin,
    countCustomer
);

module.exports = adminRoutes;
