const express = require('express');
const publicRoutes = require('./public-routes.js');
const userRoutes = require('./user-routes.js');
const AdminRoutes = require('./admin-routes.js');
const SellerRoutes = require('./seller-routes.js');
const CustomerRoutes = require('./customer-routes.js');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server its Works  🚀 ',
        author: 'Muhammad Isa',
        status_code: 200,
    });
});

router.get('/api', (req, res) => {
    res.status(200).json({
        message: 'Api its Works, Welcome 🖐 ',
        author: 'Muhammad Isa',
        status_code: 200,
    });
});
router.use('/api/', publicRoutes);
router.use('/api/', AdminRoutes);
router.use('/api/', SellerRoutes);
router.use('/api/', CustomerRoutes);
router.use('/api/', userRoutes);

router.use('*', (req, res) => {
    res.status(404).json({
        message: 'Request Not Found, Bad Request',
        status_code: 404,
    });
});
module.exports = router;
