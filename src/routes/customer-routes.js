const express = require('express');
const {
    deleteCart,
    createCart,
    getAllCart,
    createOrderTransaction,
    getAllOrder,
    getDetailOrder,
    UpdateOrderTransaction,
    UpdateOrderStatusPengiriman,
} = require('../controller/customer-controller.js');
const { AuthMiddleware } = require('../middleware/auth-middleware.js');
const { isCustomer } = require('../middleware/role-middleware.js');

const customerRoutes = express.Router();

// Carts
customerRoutes.get('/customer/carts', AuthMiddleware, isCustomer, getAllCart);
customerRoutes.post('/customer/carts', AuthMiddleware, isCustomer, createCart);
customerRoutes.delete(
    '/customer/carts/:id',
    AuthMiddleware,
    isCustomer,
    deleteCart
);

// Orders
customerRoutes.get('/customer/orders', AuthMiddleware, isCustomer, getAllOrder);
customerRoutes.get(
    '/customer/orders/:id',
    AuthMiddleware,
    isCustomer,
    getDetailOrder
);
customerRoutes.put(
    '/customer/orders/:id',
    AuthMiddleware,
    isCustomer,
    UpdateOrderTransaction
);
customerRoutes.patch(
    '/customer/orders/:id/status-pengiriman',
    AuthMiddleware,
    isCustomer,
    UpdateOrderStatusPengiriman
);
customerRoutes.post(
    '/customer/orders',
    AuthMiddleware,
    isCustomer,
    createOrderTransaction
);

module.exports = customerRoutes;
