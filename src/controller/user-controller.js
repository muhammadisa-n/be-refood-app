import prisma from '../utils/prisma.js'
import { adminValidation } from '../validation/admin-validation.js'
import { sellerValidaton } from '../validation/seller-validation.js'
import { customerValidaton } from '../validation/customer-validation.js'
import path from 'path'
import fs from 'fs'
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
        validate = customerValidaton.validate(req.body, {
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
    let filename = user.ava_image
    let url_image = user.ava_url_image
    if (req.files !== null && req.files.image) {
        const file = req.files.image
        const fileSize = file.data.length
        const ext = path.extname(file.name)
        const datenow = Date.now()
        filename = datenow + file.md5 + ext
        const userIdFolder = `./public/images/ava_images/${req.userData.user_id}`
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
                message: 'file too big minimum 10MB',
                status_code: 422,
            })

        const filepath = `${userIdFolder}/${user.image}`
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
        }

        file.mv(`${userIdFolder}/${filename}`, (err) => {
            if (err)
                return res
                    .status(500)
                    .json({ message: err.message, status_code: 500 })
        })

        url_image = `${req.protocol}://${req.get(
            'host'
        )}/profile/images/${req.userData.user_id}/${filename}`
    }

    try {
        if (role === 'Admin') {
            await prisma.admin.update({
                where: { id: req.userData.user_id },
                data: {
                    name: validate.value.name,
                    ava_image: filename,
                    ava_url_image: url_image,
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
                    ava_image: filename,
                    ava_url_image: url_image,
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
                    ava_image: filename,
                    ava_url_image: url_image,
                },
            })
        }

        res.status(200).json({ message: 'User Updated', status_code: 200 })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
