import prisma from '../utils/prisma.js'

export const getAllCart = async (req, res) => {
    const carts = await prisma.cart.findMany({
        where: { userId: req.userData.user_id },
        include: {
            Product: true,
        },
    })
    return res
        .status(200)
        .json({ message: 'All Cart Found', carts, status_code: 200 })
}

export const createCart = async (req, res) => {
    try {
        const existingCart = await prisma.cart.findFirst({
            where: {
                productId: req.body.productId,
                userId: req.userData.user_id,
            },
        })

        if (existingCart) {
            return res
                .status(200)
                .json({ message: 'Product already in cart', status_code: 200 })
        }
        await prisma.cart.create({
            data: {
                productId: req.body.productId,
                userId: req.userData.user_id,
            },
        })
        return res
            .status(201)
            .json({ message: 'Cart Created', status_code: 201 })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `${error.message}`, status_code: 201 })
    }
}
export const deleteCart = async (req, res) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                id: req.params.id,
            },
        })
        if (!cart) {
            return res
                .status(404)
                .json({ message: 'Cart Not Found', status_code: 404 })
        }
        await prisma.cart.delete({ where: { id: req.params.id } })
        return res
            .status(200)
            .json({ message: 'Cart Deleted', status_code: 200 })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `${error.message}`, status_code: 201 })
    }
}
