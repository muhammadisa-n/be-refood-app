import prisma from '../utils/prisma.js'
export const isAdmin = async (req, res, next) => {
    const admin = await prisma.admin.findFirst({
        where: { id: req.userData.user_id },
    })
    if (!admin) {
        return res.status(403).json({
            message: 'Access Forbidden ,You must be Admin',
            status_code: 403,
        })
    }
    next()
}
export const isSeller = async (req, res, next) => {
    const seller = await prisma.seller.findFirst({
        where: { id: req.userData.user_id },
    })
    if (!seller) {
        return res.status(403).json({
            message: 'Access Forbidden ,You must be Seller',
            status_code: 403,
        })
    }
    next()
}
export const isCustomer = async (req, res, next) => {
    const customer = await prisma.customer.findFirst({
        where: { id: req.userData.user_id },
    })
    if (!customer) {
        return res.status(403).json({
            message: 'Access Forbidden ,You must be Customer',
            status_code: 403,
        })
    }
    next()
}
