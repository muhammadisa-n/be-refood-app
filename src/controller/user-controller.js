import prisma from '../utils/prisma.js'
import { adminValidation } from '../validation/admin-validation.js'
import { sellerValidaton } from '../validation/seller-validation.js'
import { customerValidation } from '../validation/customer-validation.js'
import path from 'path'
import fs from 'fs'
import cloudinary from '../utils/cloudinary.js'
export const getUser = async (req, res) => {
    try {
        let user
        const role = req.userData.user_role
        if (role === 'Admin') {
            user = await prisma.admin.findUnique({
                where: {
                    id: req.userData.user_id,
                },
            })
        } else if (role === 'Seller') {
            user = await prisma.seller.findUnique({
                where: {
                    id: req.userData.user_id,
                },
            })
        } else {
            user = await prisma.customer.findUnique({
                where: {
                    id: req.userData.user_id,
                },
            })
        }
        if (!user)
            return res
                .status(200)
                .json({ message: 'User Not Found', user, status_code: 404 })
        return res
            .status(200)
            .json({ message: 'Data User Found', user, status_code: 200 })
    } catch (error) {
        return res
            .status(500)
            .json({ message: error.message, status_code: 500 })
    }
}
export const updateUser = async (req, res) => {
    let validate
    const role = req.userData.user_role
    if (role === 'Admin') {
        validate = adminValidation.validate(req.body, {
            allowUnknown: true,
        })
    } else if (role === 'Seller') {
        validate = sellerValidaton.validate(req.body, {
            allowUnknown: true,
        })
    } else {
        validate = customerValidation.validate(req.body, {
            allowUnknown: true,
        })
    }
    if (validate.error) {
        let errors = validate.error.message
        return res.status(400).json({ message: `${errors}`, status_code: 400 })
    }
    let user
    if (role === 'Admin') {
        user = await prisma.admin.findUnique({
            where: { id: req.userData.user_id },
        })
    } else if (role === 'Seller') {
        user = await prisma.seller.findUnique({
            where: { id: req.userData.user_id },
        })
    } else {
        user = await prisma.customer.findUnique({
            where: { id: req.userData.user_id },
        })
    }
    if (!user)
        return res
            .status(404)
            .json({ message: 'User not found', status_code: 404 })
    let imageId
    let imageUrl
    if (req.files === null) {
        imageId = user.ava_image_id
        imageUrl = user.ava_image_url
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
        if (user.ava_image_id !== null) {
            await cloudinary.uploader.destroy(user.ava_image_id)
        }
        const result = await cloudinary.uploader.upload(imageFile, {
            folder: `user/images/${req.userData.user_id}`,
            unique_filename: true,
            tags: `user-image`,
        })
        fs.unlinkSync(imageFile)
        imageId = result.public_id
        imageUrl = result.secure_url
    }
    try {
        if (role === 'Admin') {
            await prisma.admin.update({
                where: { id: req.userData.user_id },
                data: {
                    name: validate.value.name,
                    ava_image_id: imageId,
                    ava_image_url: imageUrl,
                },
            })
        } else if (role === 'Seller') {
            await prisma.seller.update({
                where: { id: req.userData.user_id },
                data: {
                    name: validate.value.name,
                    description: validate.value.description,
                    province: validate.value.province,
                    city: validate.value.city,
                    district: validate.value.district,
                    village: validate.value.village,
                    postal_code: validate.value.postal_code,
                    address: validate.value.address,
                    no_hp: validate.value.no_hp,
                    ava_image_id: imageId,
                    ava_image_url: imageUrl,
                    updated_at: new Date(),
                },
            })
        } else {
            await prisma.customer.update({
                where: { id: req.userData.user_id },
                data: {
                    name: validate.value.name,
                    province: validate.value.province,
                    city: validate.value.city,
                    district: validate.value.district,
                    village: validate.value.village,
                    postal_code: validate.value.postal_code,
                    address: validate.value.address,
                    no_hp: validate.value.no_hp,
                    ava_image_id: imageId,
                    ava_image_url: imageUrl,
                    updated_at: new Date(),
                },
            })
        }

        res.status(200).json({ message: 'User Updated', status_code: 200 })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `${error.message}`, status_code: 500 })
    }
}
