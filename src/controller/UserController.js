import prisma from '../utils/prisma.js'
import { UserValidation } from '../validation/UserValidation.js'
import path from 'path'
import fs from 'fs'
export const getUser = async (req, res) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: req.userData.user_email,
            },
            select: {
                id: true,
                fullname: true,
                email: true,
                address: true,
                province: true,
                city: true,
                district: true,
                village: true,
                postal_code: true,
                no_hp: true,
                image: true,
                url_image: true,
                role: true,
            },
        })
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
    const datavalidate = {
        fullname: req.body.fullname,
        city: req.body.city,
        province: req.body.province,
        district: req.body.district,
        village: req.body.village,
        postal_code: req.body.postal_code,
        address: req.body.address,
        no_hp: req.body.no_hp,
    }
    const validate = UserValidation.validate(datavalidate, {
        allowUnknown: false,
    })
    if (validate.error) {
        let errors = validate.error.message
        return res.status(400).json({ message: `${errors}`, status_code: 400 })
    }
    const user = await prisma.user.findFirst({
        where: { id: req.userData.user_id },
    })
    if (!user)
        return res
            .status(404)
            .json({ message: 'User not found', status_code: 404 })
    try {
        await prisma.user.update({
            where: { id: req.userData.user_id },
            data: {
                fullname: validate.value.fullname,
                province: validate.value.province,
                city: validate.value.city,
                district: validate.value.district,
                village: validate.value.village,
                postal_code: validate.value.postal_code,
                no_hp: validate.value.no_hp,
                address: validate.value.address,
            },
        })
        res.status(200).json({ message: 'User Updated', status_code: 200 })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
export const updateProfileImage = async (req, res) => {
    try {
        const user = await prisma.user.findFirst({
            where: { id: req.userData.user_id },
        })
        if (!user)
            return res
                .status(404)
                .json({ message: 'User not found', status_code: 404 })

        let filename = user.image
        let url_image = user.url_image
        if (req.files !== null && req.files.image) {
            const file = req.files.image
            const fileSize = file.data.length
            const ext = path.extname(file.name)
            const datenow = Date.now()
            filename = datenow + file.md5 + ext
            const userIdFolder = `./public/profile/images/${req.userData.user_id}`
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

        await prisma.user.update({
            where: { id: req.userData.user_id },
            data: {
                image: filename,
                url_image: url_image,
            },
        })
        res.status(200).json({
            message: 'User Profile Image Updated',
            status_code: 200,
        })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
