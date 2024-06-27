const { prisma } = require('../utils/prisma.js');
const isAdmin = async (req, res, next) => {
    const admin = await prisma.admin.findFirst({
        where: { id: req.userData.user_id },
    });
    if (!admin) {
        return res.status(403).json({
            message: 'Akses Terlarang, Role Kamu Harus Admin',
            status_code: 403,
        });
    }
    next();
};
const isSeller = async (req, res, next) => {
    const seller = await prisma.seller.findFirst({
        where: { id: req.userData.user_id },
    });
    if (!seller) {
        return res.status(403).json({
            message: 'Akses Terlarang, Role Kamu Harus Seller',
            status_code: 403,
        });
    }
    next();
};
const isCustomer = async (req, res, next) => {
    const customer = await prisma.customer.findFirst({
        where: { id: req.userData.user_id },
    });
    if (!customer) {
        return res.status(403).json({
            message: 'Akses Terlarang, Role Kamu Harus Customer',
            status_code: 403,
        });
    }
    next();
};

module.exports = { isAdmin, isSeller, isCustomer };
