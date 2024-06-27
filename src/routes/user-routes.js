const express = require('express');
const { AuthMiddleware } = require('../middleware/auth-middleware.js');
const { getUser, updateUser } = require('../controller/user-controller.js');

const userRoutes = express.Router();
userRoutes.get('/users/get', AuthMiddleware, getUser);
userRoutes.put('/users/update', AuthMiddleware, updateUser);
module.exports = userRoutes;
