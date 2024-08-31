const express = require('express');
const { AuthMiddleware } = require('../middleware/auth-middleware.js');
const {
    getAllProduct,
    getDetailProduct,
    countSeller,
    countCustomer,
    countProduct,
    createCategory,
    updateCategory,
    getDetailCategory,
    updateSellerStatus,
    getAllSeller,
    getAllCategory,
    getAllCustomer,
    getDetailSeller,
    getDetailCustomer,
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
adminRoutes.get('/admin/product/count', AuthMiddleware, isAdmin, countProduct);

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

// Sellers
adminRoutes.patch(
    '/admin/sellers/:id/status',
    AuthMiddleware,
    isAdmin,
    updateSellerStatus
);
adminRoutes.get('/admin/sellers', AuthMiddleware, isAdmin, getAllSeller);
adminRoutes.get('/admin/sellers/:id', AuthMiddleware, isAdmin, getDetailSeller);
adminRoutes.get('/admin/seller/count', AuthMiddleware, isAdmin, countSeller);

// Customer
adminRoutes.get('/admin/customers', AuthMiddleware, isAdmin, getAllCustomer);
adminRoutes.get(
    '/admin/customers/:id',
    AuthMiddleware,
    isAdmin,
    getDetailCustomer
);
adminRoutes.get(
    '/admin/customer/count',
    AuthMiddleware,
    isAdmin,
    countCustomer
);

module.exports = adminRoutes;
