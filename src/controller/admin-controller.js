import prisma from '../utils/prisma.js'
import { categoryValidation } from '../validation/category-validation.js'
export const getAllProduct = async (req, res) => {
    const page = Number(req.query.page) || 1
    const take = Number(req.query.take) || 10
    const skip = (page - 1) * take
    const filters = []
    if (req.query.search) {
        filters.push({
            name: {
                contains: req.query.search,
            },
        })
    }
    try {
        const products = await prisma.product.findMany({
            where: { AND: filters },
            take: take,
            skip: skip,
            orderBy: { updated_at: 'desc' },
            include: {
                Category: true,
            },
        })
        const totalProduct = await prisma.product.count({
            where: {
                AND: filters,
            },
        })
        res.status(200).json({
            message: 'Success Get  Product',
            products,
            total_product: totalProduct,
            paging: {
                current_page: page,
                total_page: Math.ceil(totalProduct / take),
            },
            status_code: 200,
        })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `${error.message}`, status_code: 500 })
    }
}
export const getAllCategory = async (req, res) => {
    const page = Number(req.query.page) || 1
    const take = Number(req.query.take) || 10
    const skip = (page - 1) * take

    const filters = []
    if (req.query.search) {
        filters.push({
            name: {
                contains: req.query.search,
            },
        })
    }
    try {
        const categories = await prisma.category.findMany({
            where: { AND: filters },
            take: take,
            skip: skip,
            orderBy: { name: 'desc' },
        })
        const totalCategory = await prisma.category.count({
            where: {
                AND: filters,
            },
        })
        res.status(200).json({
            message: 'Success Get  Seller',
            categories,
            total_category: totalCategory,
            paging: {
                current_page: page,
                total_page: Math.ceil(totalCategory / take),
            },
            status_code: 200,
        })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `${error.message}`, status_code: 500 })
    }
}
export const getAllSeller = async (req, res) => {
    const page = Number(req.query.page) || 1
    const take = Number(req.query.take) || 10
    const skip = (page - 1) * take
    const filters = []
    if (req.query.search) {
        filters.push({
            name: {
                contains: req.query.search,
            },
        })
    }
    try {
        const sellers = await prisma.seller.findMany({
            where: { AND: filters },
            take: take,
            skip: skip,
            orderBy: { updated_at: 'desc' },
        })
        const totalSeller = await prisma.seller.count({
            where: {
                AND: filters,
            },
        })
        res.status(200).json({
            message: 'Success Get  Seller',
            sellers,
            total_seller: totalSeller,
            paging: {
                current_page: page,
                total_page: Math.ceil(totalSeller / take),
            },
            status_code: 200,
        })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `${error.message}`, status_code: 500 })
    }
}
export const activateProduct = async (req, res) => {
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
            .json({ message: 'Product Activated', status_code: 200 })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `${error.message}`, status_code: 500 })
    }
}
export const countProduct = async (req, res) => {
    try {
        const totalProduct = await prisma.product.count()
        res.status(200).json({
            message: 'Success Count Product',
            total_product: totalProduct,
            status_code: 200,
        })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `${error.message}`, status_code: 500 })
    }
}
export const countSeller = async (req, res) => {
    try {
        const totalSeller = await prisma.seller.count()
        return res.status(200).json({
            message: 'Success Count Seller',
            total_seller: totalSeller,
            status_code: 200,
        })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `${error.message}`, status_code: 500 })
    }
}
export const countCustomer = async (req, res) => {
    try {
        const totalCustomer = await prisma.customer.count()
        return res.status(200).json({
            message: 'Success Count Customer',
            total_customer: totalCustomer,
            status_code: 200,
        })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `${error.message}`, status_code: 500 })
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
            .status(500)
            .json({ message: `${error.message}`, status_code: 500 })
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
            .status(500)
            .json({ message: `${error.message}`, status_code: 500 })
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
            .status(500)
            .json({ message: `${error.message}`, status_code: 500 })
    }
}

export const activateSeller = async (req, res) => {
    try {
        const seller = await prisma.seller.findFirst({
            where: { id: req.params.id },
        })
        if (!seller) {
            return res
                .status(404)
                .json({ message: 'Seller Not Found', status_code: 404 })
        }
        await prisma.seller.update({
            where: { id: req.params.id },
            data: {
                is_active: req.body.is_active,
            },
        })
        return res
            .status(200)
            .json({ message: 'Seller Activated', status_code: 200 })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `${error.message}`, status_code: 500 })
    }
}
