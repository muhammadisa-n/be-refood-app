const express = require('express');
const {
    register,
    login,
    logout,
    getAccessToken,
    verifyEmail,
    verifyForgotPassword,
    requestForgotPassword,
} = require('../controller/auth-controller.js');

const {
    getAllCategory,
    getAllProduct,
    getDetailProduct,
} = require('../controller/public-controller.js');

const publicRoutes = express.Router();
// Auth
publicRoutes.post('/auth/register', register);
publicRoutes.post('/auth/login', login);
publicRoutes.delete('/auth/logout', logout);
publicRoutes.get('/auth/verify-email', verifyEmail);
publicRoutes.post('/auth/forgot-password', requestForgotPassword);
publicRoutes.post('/auth/verify-forgot-password', verifyForgotPassword);
publicRoutes.get('/auth/token', getAccessToken);

// Product
publicRoutes.get('/products', getAllProduct);
publicRoutes.get('/products/:id', getDetailProduct);

// Category
publicRoutes.get('/categories', getAllCategory);

module.exports = publicRoutes;
