import prisma from '../utils/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
    EmailValidation,
    ForgotPasswordValidation,
    LoginValidation,
    RegisterValidation,
} from '../validation/AuthValidation.js'
import 'dotenv/config'
import transporter from '../utils/nodemailer.js'
import mustache from 'mustache'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const Register = async (req, res) => {
    const validate = RegisterValidation.validate(req.body, {
        allowUnknown: false,
    })
    if (validate.error) {
        let errors = validate.error.message
        return res.status(400).json({ message: `${errors}`, status_code: 400 })
    }
    const checkUserEmail = await prisma.user.findFirst({
        where: {
            email: validate.value.email,
        },
    })
    if (checkUserEmail) {
        return res
            .status(409)
            .json({ message: 'Email Has Been Registered', status_code: 409 })
    }
    const checkUserNoHp = await prisma.user.findFirst({
        where: {
            no_hp: validate.value.no_hp,
        },
    })
    if (checkUserNoHp) {
        return res.status(409).json({
            message: 'Number Phone Has Been Registered',
            status_code: 409,
        })
    }

    if (validate.value.password !== validate.value.confPassword) {
        return res.status(400).json({
            message: `Confirm Password Doesn't Match`,
            status_code: 400,
        })
    }
    const salt = 10
    const hashPassword = await bcrypt.hash(validate.value.password, salt)

    const verifyEmailToken = jwt.sign(
        { email: validate.value.email },
        process.env.TOKEN_SECRET,
        { expiresIn: '10m' }
    )
    const url = `${process.env.CLIENT_URL}/verification-email?token=${verifyEmailToken}`
    const templatePath = path.join(
        __dirname,
        '../templates/verifyEmail.mustache'
    )

    const template = fs.readFileSync(templatePath, 'utf-8')

    const data = { url, name: validate.value.fullname }
    const verifyEmailTemplate = mustache.render(template, data)
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: validate.value.email,
        subject: 'Email Verification',
        html: verifyEmailTemplate,
    }

    await transporter.sendMail(mailOptions)

    try {
        await prisma.user.create({
            data: {
                fullname: validate.value.fullname,
                email: validate.value.email,
                password: hashPassword,
                province: validate.value.province,
                city: validate.value.city,
                district: validate.value.district,
                village: validate.value.village,
                postal_code: validate.value.postal_code,
                address: validate.value.address,
                no_hp: validate.value.no_hp,
                role: validate.value.role,
                verified_at: null,
            },
        })
        res.status(201).json({
            message: 'Register Successfully, Please check your email to verify',
            status_code: 201,
        })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}

export const Login = async (req, res) => {
    const validate = LoginValidation.validate(req.body, { allowUnknown: false })
    if (validate.error) {
        let errors = validate.error.message
        return res.status(400).json({ message: `${errors}`, status_code: 400 })
    }
    const user = await prisma.user.findFirst({
        where: {
            email: validate.value.email,
        },
    })
    if (!user)
        return res
            .status(401)
            .json({ message: 'Wrong email or password', status_code: 401 })

    const match = await bcrypt.compare(validate.value.password, user.password)
    if (!match)
        return res
            .status(401)
            .json({ message: 'Wrong email or password', status_code: 401 })

    if (!user.verified_at) {
        const verifyEmailToken = jwt.sign(
            { email: validate.value.email },
            process.env.TOKEN_SECRET,
            { expiresIn: '10m' }
        )
        const url = `${process.env.CLIENT_URL}/verification-email?token=${verifyEmailToken}`
        const templatePath = path.join(
            __dirname,
            '../templates/verifyEmail.mustache'
        )

        const template = fs.readFileSync(templatePath, 'utf-8')

        const data = { url, name: user.fullname }
        const verifyEmailTemplate = mustache.render(template, data)
        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: validate.value.email,
            subject: 'Email Verification',
            html: verifyEmailTemplate,
        }
        await transporter.sendMail(mailOptions)
        return res.status(401).json({
            message:
                'Email Not Verified, Verification email sent. Please check your email.',
            status_code: 401,
        })
    }

    const payload = {
        user_id: user.id,
        user_email: user.email,
        user_fullname: user.fullname,
        user_role: user.role,
    }

    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '5m',
    })
    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
    })
    try {
        await prisma.user.update({
            data: {
                refresh_token,
            },
            where: {
                id: user.id,
            },
        })
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })
        return res.status(200).json({
            message: 'Login Success',
            access_token,
            status_code: 200,
        })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
export const logout = async (req, res) => {
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken)
        return res.status(401).json({
            message: 'Unauthorized,You must login  🔏',
            status_code: 401,
        })
    const user = await prisma.user.findFirst({
        where: {
            refresh_token: refreshToken,
        },
    })
    if (!user)
        return res.status(401).json({
            message: 'Unauthorized,You must login  🔏',
            status_code: 401,
        })

    const userId = user.id
    await prisma.user.update({
        data: { refresh_token: null },
        where: { id: userId },
    })
    res.clearCookie('refresh_token')
    return res.status(200).json({ message: 'Logout Success', status_code: 200 })
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token
        if (!refreshToken)
            return res.status(401).json({
                message: 'Unauthorized,You must login',
                status_code: 401,
            })
        const user = await prisma.user.findFirst({
            where: { refresh_token: refreshToken },
        })
        if (!user)
            return res
                .status(403)
                .json({ message: 'Access Forbidden', status_code: 403 })
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
            if (err)
                return res.status(403).json({
                    message: 'Access Forbidden,Token Is Invalid or Expired',
                    status_code: 403,
                })
            const payload = {
                user_id: user.id,
                user_email: user.email,
                user_fullname: user.fullname,
                user_role: user.role,
            }
            const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '5m',
                }
            )
            return res.status(200).json({ accessToken })
        })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
export const verifyEmail = async (req, res) => {
    const token = req.query.token
    if (!token) {
        return res
            .status(400)
            .json({ message: 'Token Not Found', status_code: 400 })
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        const email = decoded.email
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        })
        if (!user) {
            return res
                .status(404)
                .json({ message: 'Email Not Registered', status_code: 404 })
        }
        if (user.verified_at) {
            return res
                .status(200)
                .json({ message: 'Email Already Verified', status_code: 400 })
        }
        await prisma.user.update({
            where: { email: email },
            data: { verified_at: new Date() },
        })
        res.status(200).json({
            message: 'Verified Email Successfully',
            status_code: 200,
        })
    } catch (error) {
        return res
            .status(400)
            .json({ message: 'Invalid Token Or Expired', status_code: 400 })
    }
}

export const forgotPassword = async (req, res) => {
    const validate = EmailValidation.validate(req.body.email, {
        allowUnknown: false,
    })
    if (validate.error) {
        let errors = validate.error.message
        return res.status(400).json({ message: `${errors}`, status_code: 400 })
    }

    const email = validate.value

    const user = await prisma.user.findFirst({
        where: {
            email: email,
        },
    })
    if (!user) {
        return res
            .status(404)
            .json({ message: 'Email Not Registered', status_code: 404 })
    }

    const resetPasswordToken = jwt.sign(
        { email: email },
        process.env.TOKEN_SECRET,
        { expiresIn: '10m' }
    )
    const url = `${process.env.CLIENT_URL}/reset-password?token=${resetPasswordToken}`
    const templatePath = path.join(
        __dirname,
        '../templates/forgotPassword.mustache'
    )
    const template = fs.readFileSync(templatePath, 'utf-8')
    const data = { url, name: user.fullname }
    const forgotPasswordTemplate = mustache.render(template, data)
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Reset Your Password',
        html: forgotPasswordTemplate,
    }
    await transporter.sendMail(mailOptions)
    return res.status(200).json({
        message:
            'Password reset email sent successfully. Please check your email.',
        status_code: 200,
    })
}
export const verifyForgotPassword = async (req, res) => {
    const token = req.query.token
    if (!token) {
        return res
            .status(400)
            .json({ message: 'Token Not Found', status_code: 400 })
    }
    const validate = ForgotPasswordValidation.validate(req.body, {
        allowUnknown: false,
    })
    if (validate.error) {
        let errors = validate.error.message
        return res.status(400).json({ message: `${errors}`, status_code: 400 })
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        const email = decoded.email
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        })
        if (!user) {
            return res.status(404).json({
                message: 'Email Not Registered',
                status_code: 404,
            })
        }
        if (validate.value.newPassword !== validate.value.confPassword) {
            return res.status(400).json({
                message: `Confirm Password Doesn't Match`,
                status_code: 400,
            })
        }
        const salt = 10
        const hashPassword = await bcrypt.hash(validate.value.newPassword, salt)
        await prisma.user.update({
            where: { email: email },
            data: { password: hashPassword },
        })
        res.status(200).json({
            message: 'Reset Password Successfully',
            status_code: 200,
        })
    } catch (error) {
        return res.status(400).json({
            message: 'Invalid Token Or Expired',
            status_code: 400,
            error: error.message,
        })
    }
}
