import prisma from '../utils/prisma.js'
import path from 'path'
import fs from 'fs'
import cloudinary from '../utils/cloudinary.js'

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
    if (!req.files || !req.files.image) {
        return res
            .status(400)
            .json({ message: 'No Image Uploaded', status_code: 400 })
    }
    const validate = productValidation.validate(req.body, {
        allowUnknown: false,
    })
    if (validate.error) {
        let errors = validate.error.message
        return res.status(400).json({ message: `${errors}`, status_code: 400 })
    }
    const file = req.files.image
    const fileSize = file.size
    const ext = path.extname(file.name)
    const allowedType = ['.png', '.jpg', '.jpeg']
    const imageFile = file.tempFilePath
    if (!allowedType.includes(ext.toLowerCase())) {
        fs.unlinkSync(imageFile)
        return res.status(422).json({
            message:
                'Invalid Image Format. Only PNG, JPG, And JPEG Formats Are Allowed',
            status_code: 422,
        })
    }
    if (fileSize > 5 * 1024 * 1024) {
        fs.unlinkSync(imageFile)
        console.log(imageFile)
        return res.status(422).json({
            message: 'File To Big Maximum 5MB',
            status_code: 422,
        })
    }
    try {
        const result = await cloudinary.uploader.upload(imageFile, {
            folder: `products/images/${req.userData.user_id}`,
            unique_filename: true,
            tags: `product-image`,
        })
        fs.unlinkSync(imageFile)

        await prisma.product.create({
            data: {
                name: validate.value.name,
                description: validate.value.description,
                price: validate.value.price,
                stock: validate.value.stock,
                category_id: validate.value.category_id,
                image_id: result.public_id,
                image_url: result.secure_url,
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
        where: { id: req.params.id, seller_id: req.userData.user_id },
    })
    if (!product)
        return res
            .status(404)
            .json({ message: 'Product Not Found', status_code: 404 })
    let imageId
    let imageUrl
    if (req.files === null) {
        imageId = product.image_id
        imageUrl = product.image_url
    } else if (req.files.image) {
        const file = req.files.image
        const fileSize = file.size
        const ext = path.extname(file.name)
        const allowedType = ['.png', '.jpeg', '.jpg']
        const imageFile = file.tempFilePath
        if (!allowedType.includes(ext.toLowerCase())) {
            fs.unlinkSync(imageFile)
            return res.status(422).json({
                message:
                    'Invalid Image Format. Only PNG, JPG, And JPEG Formats Are Allowed',
                status_code: 422,
            })
        }
        if (fileSize > 5 * 1024 * 1024) {
            fs.unlinkSync(imageFile)
            return res.status(422).json({
                message: 'File To Big Maximum 5MB',
                status_code: 422,
            })
        }
        await cloudinary.uploader.destroy(product.image_id)
        const result = await cloudinary.uploader.upload(imageFile, {
            folder: `products/images/${req.userData.user_id}`,
            unique_filename: true,
            tags: `product-image`,
        })
        fs.unlinkSync(imageFile)
        imageId = result.public_id
        imageUrl = result.secure_url
    }
    try {
        await prisma.product.update({
            where: { id: req.params.id },
            data: {
                name: validate.value.name,
                description: validate.value.description,
                price: validate.value.price,
                category_id: validate.value.category_id,
                image_id: imageId,
                image_url: imageUrl,
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
    const product = await prisma.product.findFirst({
        where: { id: req.params.id, seller_id: req.userData.user_id },
    })
    if (!product)
        return res
            .status(404)
            .json({ message: 'Product Not Found', status_code: 404 })
    try {
        await cloudinary.uploader.destroy(product.image_id)
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
