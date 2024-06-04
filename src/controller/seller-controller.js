import prisma from '../utils/prisma.js'
import path from 'path'
import fs from 'fs'
import { productValidation } from '../validation/product-validation.js'
export const getAllProduct = async (req, res) => {
    let take = Number(req.query.take) || 0
    let skip = Number(req.query.skip) || 0
    try {
        if (take) {
            const product = await prisma.product.findMany({
                where: { seller_id: req.userData.user_id },
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
                where: { seller_id: req.userData.user_id },
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
export const createProduct = async (req, res) => {
    if (req.files === null) {
        return res
            .status(400)
            .json({ message: 'No File Uploaded', status_code: 400 })
    }
    const validate = productValidation.validate(req.body, {
        allowUnknown: false,
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
    const userIdFolder = `./public/images/products/${req.userData.user_id}`
    if (!fs.existsSync(userIdFolder)) {
        fs.mkdirSync(userIdFolder)
    }
    const product_url_image = `${req.protocol}://${req.get(
        'host'
    )}/images/products/${req.userData.user_id}/${filename}`
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

    file.mv(`${userIdFolder}/${filename}`, async (err) => {
        if (err)
            return res
                .status(500)
                .json({ message: err.message, status_code: 500 })
    })
    try {
        await prisma.product.create({
            data: {
                name: validate.value.name,
                description: validate.value.description,
                price: validate.value.price,
                stock: validate.value.stock,
                category_id: validate.value.category_id,
                product_image: filename,
                product_url_image: product_url_image,
                seller_id: req.userData.user_id,
            },
        })
        return res
            .status(201)
            .json({ message: 'Product Created', status_code: 201 })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
export const updateProduct = async (req, res) => {
    const validate = productValidation.validate(req.body, {
        allowUnknown: true,
    })
    if (validate.error) {
        let errors = validate.error.message
        return res.status(400).json({ message: `${errors}`, status_code: 400 })
    }
    const product = await prisma.product.findFirst({
        where: { id: req.params.id, user_id: req.userData.user_id },
    })
    if (!product)
        return res
            .status(404)
            .json({ message: 'Product not found', status_code: 404 })
    let filename = ''
    if (req.files === null) {
        filename = product.product_image
    } else {
        const file = req.files.image
        const fileSize = file.data.length
        const ext = path.extname(file.name)
        const datenow = Date.now()
        filename = datenow + file.md5 + ext
        const userIdFolder = `./public/images/products/${req.userData.user_id}`
        if (!fs.existsSync(userIdFolder)) {
            fs.mkdirSync(userIdFolder)
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
        const filepath = `${userIdFolder}/${product.product_image}`
        fs.unlinkSync(filepath)
        file.mv(`${userIdFolder}/${filename}`, (err) => {
            if (err)
                return res
                    .status(500)
                    .json({ message: err.message, status_code: 500 })
        })
    }
    const product_url_image = `${req.protocol}://${req.get(
        'host'
    )}/images/products/${req.userData.user_id}/${filename}`
    try {
        await prisma.product.update({
            where: { id: req.params.id },
            data: {
                name: validate.value.name,
                description: validate.value.description,
                price: validate.value.price,
                category_id: validate.value.category_id,
                product_image: filename,
                product_url_image: product_url_image,
                updated_at: new Date(),
            },
        })
        return res
            .status(200)
            .json({ message: 'Product Updated', status_code: 200 })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
export const deleteProduct = async (req, res) => {
    const product = await prisma.product.findUnique({
        where: { id: req.params.id, seller_id: req.userData.user_id },
    })
    if (!product)
        return res
            .status(404)
            .json({ message: 'Product not found', status_code: 404 })
    try {
        const filepath = `./public/images/products/${req.userData.user_id}/${product.image}`
        fs.unlinkSync(filepath)
        const userIdFolder = `./public/images/products${req.userData.user_id}`
        const userProducts = await prisma.product.findMany({
            where: { userId: req.userData.user_id },
        })
        if (userProducts.length === 1 && userProducts[0].id === req.params.id) {
            fs.rmdirSync(userIdFolder)
        }

        await prisma.product.delete({
            where: { id: req.params.id, seller_id: req.userData.user_id },
        })
        return res
            .status(200)
            .json({ message: 'Product Deleted', status_code: 200 })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
