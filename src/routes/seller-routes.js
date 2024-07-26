const express = require('express');
const { AuthMiddleware } = require('../middleware/auth-middleware.js');
const {
    getAllProduct,
    getDetailProduct,
    createProduct,
    updateProduct,
    countProduct,
    verifySeller,
    getAllOrder,
    getDetailOrder,
    countOrder,
    updateStatusOrder,
    countPendapatan,
} = require('../controller/seller-controller.js');
const { isSeller } = require('../middleware/role-middleware.js');

const sellerRoutes = express.Router();

sellerRoutes.post('/seller/activate', AuthMiddleware, isSeller, verifySeller);
// products
sellerRoutes.get('/seller/products', AuthMiddleware, isSeller, getAllProduct);
sellerRoutes.get(
    '/seller/products/:id',
    AuthMiddleware,
    isSeller,
    getDetailProduct
);
sellerRoutes.post('/seller/products', AuthMiddleware, isSeller, createProduct);
sellerRoutes.put(
    '/seller/products/:id',
    AuthMiddleware,
    isSeller,
    updateProduct
);
sellerRoutes.get(
    '/seller/product/count',
    AuthMiddleware,
    isSeller,
    countProduct
);
// Orders
sellerRoutes.get('/seller/order/count', AuthMiddleware, isSeller, countOrder);
sellerRoutes.get('/seller/orders', AuthMiddleware, isSeller, getAllOrder);
sellerRoutes.get(
    '/seller/orders/:id',
    AuthMiddleware,
    isSeller,
    getDetailOrder
);
sellerRoutes.patch(
    '/seller/orders/:id/status-order',
    AuthMiddleware,
    isSeller,
    updateStatusOrder
);
sellerRoutes.get(
    '/seller/pendapatan/count',
    AuthMiddleware,
    isSeller,
    countPendapatan
);
module.exports = sellerRoutes;
