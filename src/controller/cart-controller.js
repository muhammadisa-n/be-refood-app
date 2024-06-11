import prisma from '../utils/prisma.js'
import { cartValidation } from '../validation/cart-validation.js'

export const getAllCart = async (req, res) => {
    const carts = await prisma.cart.findMany({
        where: { customer_id: req.userData.user_id },
        orderBy: { updated_at: 'desc' },
        include: {
            Product: true,
        },
    })
    return res
        .status(200)
        .json({ message: 'All Cart Found', carts, status_code: 200 })
}

export const createCart = async (req, res) => {
    const validate = cartValidation.validate(req.body, {
        allowUnknown: false,
    })
    if (validate.error) {
        let errors = validate.error.message
        return res.status(400).json({ message: `${errors}`, status_code: 400 })
    }
    try {
        const existingCart = await prisma.cart.findFirst({
            where: {
                product_id: req.body.product_id,
                customer_id: req.userData.user_id,
            },
        })

        if (existingCart) {
            const prevTotalProduct = existingCart.total_product
            const prevTotalPrice = existingCart.total_price
            await prisma.cart.update({
                where: {
                    product_id: req.body.product_id,
                },
                data: {
                    total_product: prevTotalProduct + req.body.total_product,
                    total_price: prevTotalPrice + req.body.total_price,
                    customer_id: req.userData.user_id,
                    updated_at: new Date(),
                },
            })
            return res
                .status(200)
                .json({ message: 'Cart Created', status_code: 200 })
        }
        await prisma.cart.create({
            data: {
                total_product: req.body.total_product,
                total_price: req.body.total_price,
                product_id: req.body.product_id,
                customer_id: req.userData.user_id,
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
                product_id: req.params.id,
                customer_id: req.userData.user_id,
            },
        })
        if (!cart) {
            return res
                .status(404)
                .json({ message: 'Cart Not Found', status_code: 404 })
        }
        await prisma.cart.delete({ where: { product_id: cart.product_id } })
        return res
            .status(200)
            .json({ message: 'Cart Deleted', status_code: 200 })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `${error.message}`, status_code: 201 })
    }
}
