const express = require('express');
const { AuthMiddleware } = require('../middleware/auth-middleware.js');
const {
    getAllProduct,
    getDetailProduct,
    createProduct,
    deleteProduct,
    updateProduct,
    countProduct,
    verifySeller,
    getAllOrder,
    getDetailOrder,
    UpdateOrderStatusPengiriman,
} = require('../controller/seller-controller.js');
const { isSeller } = require('../middleware/role-middleware.js');

const sellerRoutes = express.Router();

sellerRoutes.post('/seller/activate', AuthMiddleware, isSeller, verifySeller);

// products
sellerRoutes.get('/seller/products', AuthMiddleware, isSeller, getAllProduct);
sellerRoutes.get('/seller/orders', AuthMiddleware, isSeller, getAllOrder);
sellerRoutes.get(
    '/seller/products/:id',
    AuthMiddleware,
    isSeller,
    getDetailProduct
);
sellerRoutes.get(
    '/seller/orders/:id',
    AuthMiddleware,
    isSeller,
    getDetailOrder
);
sellerRoutes.post('/seller/products', AuthMiddleware, isSeller, createProduct);
sellerRoutes.put(
    '/seller/products/:id',
    AuthMiddleware,
    isSeller,
    updateProduct
);
sellerRoutes.delete(
    '/seller/products/:id',
    AuthMiddleware,
    isSeller,
    deleteProduct
);
sellerRoutes.get(
    '/seller/product/count',
    AuthMiddleware,
    isSeller,
    countProduct
);
sellerRoutes.patch(
    '/seller/orders/:id/status-pengiriman',
    AuthMiddleware,
    isSeller,
    UpdateOrderStatusPengiriman
);
module.exports = sellerRoutes;
