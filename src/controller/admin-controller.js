import prisma from '../utils/prisma.js'
import { categoryValidation } from '../validation/category-validation.js'
export const getAllProduct = async (req, res) => {
    let take = Number(req.query.take) || 0
    let skip = Number(req.query.skip) || 0
    try {
        if (take) {
            const product = await prisma.product.findMany({
                take,
                skip,
                orderBy: { updated_at: 'desc' },
                include: {
                    Category: true,
                },
            })
            let lastProduct = product[take - 1]
            const cursor = lastProduct.id
            res.status(200).json({
                message: 'All Data Product Found',
                product,
                cursor: cursor,
                amount: product.length,
                status_code: 200,
            })
        } else {
            const product = await prisma.product.findMany({
                orderBy: { created_at: 'desc' },
                include: {
                    Category: true,
                },
            })
            res.status(200).json({
                message: 'All Data Product Found',
                product,
                amount: product.length,
                status_code: 200,
            })
        }
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
export const changeStatusProduct = async (req, res) => {
    try {
        const product = await prisma.product.findFirst({
            where: { id: req.params.id },
        })
        if (!product) {
            return res
                .status(404)
                .json({ message: 'Product Not Found', status_code: 404 })
        }
        await prisma.product.update({
            where: { id: req.params.id },
            data: {
                is_active: req.body.is_active,
            },
        })
        return res
            .status(200)
            .json({ message: 'Status Product Change', status_code: 200 })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}

export const countSeller = async (req, res) => {
    try {
        const sellers = await prisma.seller.count()
        return res.status(200).json({ amount: sellers, status_code: 200 })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
export const countCustomer = async (req, res) => {
    try {
        const customer = await prisma.customer.count()
        return res.status(200).json({ amount: customer, status_code: 200 })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}

export const createCategory = async (req, res) => {
    const validate = categoryValidation.validate(req.body, {
        allowUnknown: false,
    })
    if (validate.error) {
        let errors = validate.error.message
        return res.status(400).json({ message: `${errors}`, status_code: 400 })
    }

    try {
        await prisma.category.create({
            data: {
                name: validate.value.name,
            },
        })
        return res
            .status(201)
            .json({ message: 'Category Created', status_code: 201 })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
export const getDetailCategory = async (req, res) => {
    const category = await prisma.category.findUnique({
        where: { id: Number(req.params.id) },
    })

    if (!category) {
        return res
            .status(404)
            .json({ message: 'Category Not Found', status_code: 404 })
    }
    return res.status(200).json({
        message: 'All Data Category Found',
        category,
        status_code: 200,
    })
}
export const updateCategory = async (req, res) => {
    const validate = categoryValidation.validate(req.body, {
        allowUnknown: false,
    })
    if (validate.error) {
        let errors = validate.error.message
        return res.status(400).json({ message: `${errors}`, status_code: 400 })
    }
    const category = await prisma.category.findFirst({
        where: { id: Number(req.params.id) },
    })
    if (!category)
        return res
            .status(404)
            .json({ message: 'Category not found', status_code: 404 })

    try {
        await prisma.category.update({
            where: { id: Number(req.params.id) },
            data: {
                name: validate.value.name,
            },
        })
        return res
            .status(200)
            .json({ message: 'Category Updated', status_code: 200 })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}

export const deleteCategory = async (req, res) => {
    const category_id = Number(req.params.id)
    if (isNaN(category_id)) {
        return res
            .status(404)
            .json({ message: 'Category not found', status_code: 404 })
    }
    const category = await prisma.category.findUnique({
        where: { id: category_id },
    })
    if (!category)
        return res
            .status(404)
            .json({ message: 'Category not found', status_code: 404 })
    try {
        await prisma.category.delete({
            where: { id: Number(req.params.id) },
        })
        return res
            .status(200)
            .json({ message: 'Category Deleted', status_code: 200 })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
