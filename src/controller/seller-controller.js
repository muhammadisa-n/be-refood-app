import prisma from '../utils/prisma.js'
import path from 'path'
import fs from 'fs'
import cloudinary from '../utils/cloudinary.js'
import { productValidation } from '../validation/product-validation.js'
import { VerificationSellerValidation } from '../validation/seller-validation.js'
export const getAllProduct = async (req, res) => {
    const page = Number(req.query.page) || 1
    const skip = (page - 1) * Number(req.query.size)
    const filters = []
    filters.push({
        seller_id: req.userData.user_id,
    })
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
            take: Number(req.query.size),
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
                total_page: Math.ceil(totalProduct / req.query.size),
            },
            status_code: 200,
        })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
export const countProduct = async (req, res) => {
    try {
        const totalProduct = await prisma.product.count({
            where: { seller_id: req.userData.user_id },
        })
        res.status(200).json({
            message: 'Success Count Product',
            total_product: totalProduct,
            status_code: 200,
        })
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
    const seller = await prisma.seller.findFirst({
        where: { id: req.userData.user_id },
    })
    if (seller.is_active === false) {
        return res.status(403).json({
            message: 'Access Forbidden ,You must Activate Your Account',
            status_code: 403,
        })
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
    const seller = await prisma.seller.findFirst({
        where: { id: req.userData.user_id },
    })
    if (seller.is_active === false) {
        return res.status(403).json({
            message: 'Access Forbidden ,You must Activate Your Account',
            status_code: 403,
        })
    }
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
    const seller = await prisma.seller.findFirst({
        where: { id: req.userData.user_id },
    })
    if (seller.is_active === false) {
        return res.status(403).json({
            message: 'Access Forbidden ,You must Activate Your Account',
            status_code: 403,
        })
    }
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

export const verifySeller = async (req, res) => {
    if (!req.files || !req.files.image) {
        return res
            .status(400)
            .json({ message: 'No Image Uploaded', status_code: 400 })
    }
    const validate = VerificationSellerValidation.validate(req.body, {
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
    const seller = await prisma.seller.findFirst({
        where: { id: req.userData.user_id },
    })
    if (seller.sample_image_product_id !== null) {
        try {
            await cloudinary.uploader.destroy(seller.sample_image_product_id)
        } catch (error) {
            return res
                .status(501)
                .json({ message: `${error.message}`, status_code: 501 })
        }
    }
    try {
        const result = await cloudinary.uploader.upload(imageFile, {
            folder: `products/images/${req.userData.user_id}/sample-products`,
            unique_filename: true,
            tags: `sample-product-image`,
        })
        fs.unlinkSync(imageFile)

        await prisma.seller.update({
            where: { id: req.userData.user_id },
            data: {
                link_map_merchant: validate.value.link_map,
                sample_image_product_id: result.public_id,
                sample_image_product_url: result.secure_url,
            },
        })

        return res.status(200).json({ message: 'Success', status_code: 200 })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
