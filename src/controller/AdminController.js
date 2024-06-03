import prisma from '../utils/prisma.js'
import path from 'path'
import fs from 'fs'
import { CategoryValidation } from '../validation/CategoryValidation.js'
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
            let lastproduct = product[take - 1]
            const myCursor = lastproduct.id
            if (product.length === 0)
                return res.status(200).json({
                    message: 'Data Product is Empty',
                    product,
                    amount: product.length,
                    status_code: 200,
                })
            res.status(200).json({
                message: 'All Data Product Found',
                product,
                cursor: myCursor,
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
            if (product.length === 0)
                return res.status(200).json({
                    message: 'Data Product is Empty',
                    product,
                    amount: product.length,
                    status_code: 200,
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
                is_valid: req.body.is_valid,
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
        const response = await prisma.user.count({ where: { role: 'Seller' } })
        return res.status(200).json({ amount: response, status_code: 200 })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
export const countCustomer = async (req, res) => {
    try {
        const response = await prisma.user.count({
            where: { role: 'Customer' },
        })
        return res.status(200).json({ amount: response, status_code: 200 })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}

export const createCategory = async (req, res) => {
    if (req.files === null) {
        return res
            .status(400)
            .json({ message: 'No Image Uploaded', status_code: 400 })
    }
    const validate = CategoryValidation.validate(req.body, {
        allowUnknown: true,
    })
    if (validate.error) {
        let errors = validate.error.message
        return res.status(400).json({ message: `${errors}`, status_code: 400 })
    }
    const file = req.files.image
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    const datenow = Date.now()
    const filename = datenow + file.md5 + ext
    const CategoryFolder = `./public/categories/images`
    if (!fs.existsSync(CategoryFolder)) {
        fs.mkdirSync(CategoryFolder)
    }
    const url_image = `${req.protocol}://${req.get(
        'host'
    )}/categories/images/${filename}`
    const allowedType = ['.png', '.jpg', '.jpeg']
    if (!allowedType.includes(ext.toLowerCase())) {
        return res
            .status(422)
            .json({ message: 'invalid type image', status_code: 422 })
    }
    if (fileSize > 1000000)
        return res
            .status(422)
            .json({ message: 'file to big minimum 10MB', status_code: 422 })

    file.mv(`${CategoryFolder}/${filename}`, async (err) => {
        if (err)
            return res
                .status(500)
                .json({ message: err.message, status_code: 500 })
    })
    try {
        await prisma.category.create({
            data: {
                name: validate.value.name,
                image: filename,
                url_image,
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
export const updateCategory = async (req, res) => {
    const validate = CategoryValidation.validate(req.body, {
        allowUnknown: true,
    })
    if (validate.error) {
        let errors = validate.error.message
        return res.status(400).json({ message: `${errors}`, status_code: 400 })
    }
    const category = await prisma.category.findFirst({
        where: { id: parseInt(req.params.id) },
    })
    if (!category)
        return res
            .status(404)
            .json({ message: 'Category not found', status_code: 404 })
    let filename = ''
    if (req.files === null) {
        filename = category.image
    } else {
        const file = req.files.image
        const fileSize = file.data.length
        const ext = path.extname(file.name)
        const datenow = Date.now()
        filename = datenow + file.md5 + ext
        const CategoryFolder = `./public/categories/images`
        if (!fs.existsSync(CategoryFolder)) {
            fs.mkdirSync(CategoryFolder)
        }
        const allowedType = ['.png', '.jpeg', '.jpg']
        if (!allowedType.includes(ext.toLowerCase()))
            return res
                .status(422)
                .json({ message: 'invalid type image', status_code: 422 })
        if (fileSize > 10000000)
            return res.status(422).json({
                message: 'file to big minimum 10MB',
                status_code: 422,
            })
        const filepath = `${CategoryFolder}/${category.image}`
        fs.unlinkSync(filepath)
        file.mv(`${CategoryFolder}/${filename}`, (err) => {
            if (err)
                return res
                    .status(500)
                    .json({ message: err.message, status_code: 500 })
        })
    }
    const url_image = `${req.protocol}://${req.get(
        'host'
    )}/categories/images/${filename}`
    try {
        await prisma.category.update({
            where: { id: Number(req.params.id) },
            data: {
                name: validate.value.name,
                image: filename,
                url_image,
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
export const getDetailCategory = async (req, res) => {
    const categoryId = Number(req.params.id)
    if (isNaN(categoryId)) {
        return res
            .status(404)
            .json({ message: 'Category not found', status_code: 404 })
    }
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    })
    if (!category)
        return res
            .status(404)
            .json({ message: 'Category not found', status_code: 404 })
    return res.status(200).json({ category, status_code: 200 })
}

export const deleteCategory = async (req, res) => {
    const categoryId = Number(req.params.id)
    if (isNaN(categoryId)) {
        return res
            .status(404)
            .json({ message: 'Category not found', status_code: 404 })
    }
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    })
    if (!category)
        return res
            .status(404)
            .json({ message: 'Category not found', status_code: 404 })
    try {
        const filepath = `./public/categories/images/${category.image}`
        fs.unlinkSync(filepath)
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
