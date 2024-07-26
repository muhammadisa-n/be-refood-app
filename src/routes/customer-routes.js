const express = require('express');
const {
    deleteCart,
    createCart,
    getAllCart,
    createOrder,
    getAllOrder,
    getDetailOrder,
    updateOrder,
    cancelOrder,
    updateStatusOrder,
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
    updateOrder
);
customerRoutes.patch(
    '/customer/orders/:id/cancel',
    AuthMiddleware,
    isCustomer,
    cancelOrder
);
customerRoutes.patch(
    '/customer/orders/:id/status-order',
    AuthMiddleware,
    isCustomer,
    updateStatusOrder
);
customerRoutes.post(
    '/customer/orders',
    AuthMiddleware,
    isCustomer,
    createOrder
);

module.exports = customerRoutes;
