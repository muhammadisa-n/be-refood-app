require('dotenv/config');
const { prisma } = require('../utils/prisma.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/nodemailer.js');
const mustache = require('mustache');
const fs = require('fs');
const path = require('path');
const validate = require('../validation/validation.js');
const {
    registerValidation,
    loginValidation,
    emailValidation,
} = require('../validation/auth-validation.js');
const ResponseError = require('../utils/response-error.js');

module.exports = {
    register: async (data) => {
        const dataValidate = validate(registerValidation, data);
        const checkUser = await prisma.$transaction([
            prisma.admin.findUnique({ where: { email: dataValidate.email } }),
            prisma.seller.findUnique({ where: { email: dataValidate.email } }),
            prisma.customer.findUnique({
                where: { email: dataValidate.email },
            }),
            prisma.seller.findUnique({ where: { no_hp: dataValidate.no_hp } }),
            prisma.customer.findUnique({
                where: { no_hp: dataValidate.no_hp },
            }),
        ]);

        if (checkUser[0] || checkUser[1] || checkUser[2]) {
            throw ResponseError(409, 'Email Telah Terdaftar');
        }

        if (checkUser[3] || checkUser[4]) {
            throw ResponseError(409, 'Nomor HP Telah Terdaftar');
        }

        const salt = 10;
        const hashPassword = await bcrypt.hash(dataValidate.password, salt);

        const verifyEmailToken = jwt.sign(
            { email: dataValidate.email, role: dataValidate.role },
            process.env.TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        const url = `${process.env.CLIENT_URL}/verification-email?token=${verifyEmailToken}`;

        const template = fs.readFileSync(
            path.join(__dirname, '../templates/verify-email.mustache'),
            'utf-8'
        );

        const dataTemplate = { url, name: dataValidate.nama };
        const verifyEmailTemplate = mustache.render(template, dataTemplate);
        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: dataValidate.email,
            subject: 'Email Verification',
            html: verifyEmailTemplate,
        };

        await transporter.sendMail(mailOptions);

        const dataRegister = {
            nama: dataValidate.nama,
            email: dataValidate.email,
            password: hashPassword,
            provinsi: dataValidate.provinsi,
            kota: dataValidate.kota,
            kecamatan: dataValidate.kecamatan,
            kelurahan: dataValidate.kelurahan,
            kode_pos: dataValidate.kode_pos,
            alamat: dataValidate.alamat,
            no_hp: dataValidate.no_hp,
            verified_at: null,
            created_at: new Date(),
            updated_at: new Date(),
        };

        if (dataValidate.role === 'Seller') {
            await prisma.seller.create({
                data: dataRegister,
            });
        } else if ((dataValidate, role)) {
            await prisma.customer.create({
                data: dataRegister,
            });
        }
    },
    login: async (data) => {
        const dataValidate = validate(loginValidation, data);
        let user;
        let role;
        const [admin, seller, customer] = await prisma.$transaction([
            prisma.admin.findUnique({ where: { email: dataValidate.email } }),
            prisma.seller.findUnique({ where: { email: dataValidate.email } }),
            prisma.customer.findUnique({
                where: { email: dataValidate.email },
            }),
        ]);
        if (admin) {
            user = admin;
            role = 'Admin';
        } else if (seller) {
            user = seller;
            role = 'Seller';
        } else if (customer) {
            user = customer;
            role = 'Customer';
        }

        if (!user) {
            throw ResponseError(401, 'Email Atau Password Salah!');
        }

        const match = await bcrypt.compare(
            dataValidate.password,
            user.password
        );
        if (!match) {
            throw ResponseError(401, 'Email Atau Password Salah!');
        }

        if (!user.verified_at) {
            throw ResponseError(401, 'Email Belum Diverifikasi');
        }
        const payload = {
            user_id: user.id,
            user_email: user.email,
            user_name: user.nama,
            user_role: role,
        };
        const access_token = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '10m',
            }
        );
        const refresh_token = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '1d',
            }
        );
        if (role === 'Admin') {
            await prisma.admin.update({
                data: { refresh_token },
                where: { id: user.id },
            });
        } else if (role === 'Seller') {
            await prisma.seller.update({
                data: { refresh_token },
                where: { id: user.id },
            });
        } else if (role === 'Customer') {
            await prisma.customer.update({
                data: { refresh_token },
                where: { id: user.id },
            });
        }

        return { access_token, refresh_token };
    },
    logout: async (refreshToken) => {
        if (!refreshToken) {
            throw ResponseError(401, 'Unauthorized, Kamu Harus Login');
        }
        let user;
        let role;
        const [admin, seller, customer] = await prisma.$transaction([
            prisma.admin.findFirst({
                where: { refresh_token: refreshToken },
            }),
            prisma.seller.findFirst({
                where: { refresh_token: refreshToken },
            }),
            prisma.customer.findFirst({
                where: { refresh_token: refreshToken },
            }),
        ]);
        if (admin) {
            user = admin;
            role = 'Admin';
        } else if (seller) {
            user = seller;
            role = 'Seller';
        } else if (customer) {
            user = customer;
            role = 'Customer';
        }
        if (!user) {
            throw ResponseError(401, 'Unauthorized, Kamu Harus Login');
        }
        const user_id = user.id;
        if (role === 'Admin') {
            await prisma.admin.update({
                data: { refresh_token: null },
                where: { id: user_id },
            });
        } else if (role === 'Seller') {
            await prisma.seller.update({
                data: { refresh_token: null },
                where: { id: user_id },
            });
        } else if (role === 'Customer') {
            await prisma.customer.update({
                data: { refresh_token: null },
                where: { id: user_id },
            });
        }
    },
    getAccessToken: async (refreshToken) => {
        if (!refreshToken) {
            throw ResponseError(401, 'Unauthorized, Kamu Harus Login');
        }
        let user;
        let role;
        const [admin, seller, customer] = await prisma.$transaction([
            prisma.admin.findFirst({
                where: { refresh_token: refreshToken },
            }),
            prisma.seller.findFirst({
                where: { refresh_token: refreshToken },
            }),
            prisma.customer.findFirst({
                where: { refresh_token: refreshToken },
            }),
        ]);
        if (admin) {
            user = admin;
            role = 'Admin';
        } else if (seller) {
            user = seller;
            role = 'Seller';
        } else if (customer) {
            user = customer;
            role = 'Customer';
        }
        if (!user) {
            throw ResponseError(401, 'Unauthorized, Kamu Harus Login');
        }
        try {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {
            throw ResponseError(
                401,
                'Unauthorized, Token Tidak Valid Atau Kadaluarsa'
            );
        }
        const payload = {
            user_id: user.id,
            user_email: user.email,
            user_name: user.nama,
            user_role: role,
        };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '10m',
        });
        return accessToken;
    },
    verifyEmail: async (token) => {
        if (!token) {
            throw ResponseError(404, 'Params Query Token Tidak Ada');
        }
        let decodedData;
        try {
            decodedData = jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (error) {
            throw ResponseError(
                401,
                'Unauthorized, Token Tidak Valid Atau Kadaluarsa'
            );
        }
        let user;
        const [admin, seller, customer] = await prisma.$transaction([
            prisma.admin.findFirst({ where: { email: decodedData.email } }),
            prisma.seller.findFirst({ where: { email: decodedData.email } }),
            prisma.customer.findFirst({ where: { email: decodedData.email } }),
        ]);
        if (role === 'Admin') {
            user = admin;
        } else if (role === 'Seller') {
            user = seller;
        } else {
            user = customer;
        }
        if (user.verified_at) {
            throw ResponseError(409, 'Email Sudah Terverifikasi');
        }
        if (role === 'Admin') {
            await prisma.admin.update({
                where: { email: decodedData.email },
                data: { verified_at: new Date() },
            });
        } else if (role === 'Seller') {
            await prisma.seller.update({
                where: { email: decodedData.email },
                data: { verified_at: new Date() },
            });
        } else {
            await prisma.customer.update({
                where: { email: decodedData.email },
                data: { verified_at: new Date() },
            });
        }
    },
    forgotPassword: async (data) => {
        const email = validate(emailValidation, data);

        let user;
        let role;
        const [admin, seller, customer] = await prisma.$transaction([
            prisma.admin.findFirst({ where: { email: email } }),
            prisma.seller.findFirst({ where: { email: email } }),
            prisma.customer.findFirst({ where: { email: email } }),
        ]);
        if (admin) {
            user = admin;
            role = 'Admin';
        } else if (seller) {
            user = seller;
            role = 'Seller';
        } else if (customer) {
            user = customer;
            role = 'Customer';
        }
        if (!user) {
            throw ResponseError(404, 'Email Tidak Terdaftar');
        }
        const resetPasswordToken = jwt.sign(
            { email: email, role: role },
            process.env.TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        const url = `${process.env.CLIENT_URL}/reset-password?token=${resetPasswordToken}`;

        const template = fs.readFileSync(
            path.join(__dirname, '../templates/forgot-password.mustache'),
            'utf-8'
        );
        const dataUser = { url, name: user.nama };
        const forgotPasswordTemplate = mustache.render(template, dataUser);
        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: email,
            subject: 'Reset Your Password',
            html: forgotPasswordTemplate,
        };
        await transporter.sendMail(mailOptions);
    },
    verifyForgotPassword: async (token, data) => {
        if (!token) {
            throw ResponseError(404, 'Params Query Token Tidak Ada');
        }
        let decodedData;
        try {
            decodedData = jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (error) {
            throw ResponseError(
                401,
                'Unauthorized, Token Tidak Valid Atau Kadaluarsa'
            );
        }
        const { email, role } = decodedData;
        const dataValidate = validate(forgotPasswordValidation, data);
        const salt = 10;
        const hashPassword = await bcrypt.hash(dataValidate.password, salt);
        if (role === 'Admin') {
            await prisma.admin.update({
                where: { email: email },
                data: { password: hashPassword },
            });
        } else if (role === 'Seller') {
            await prisma.seller.update({
                where: { email: email },
                data: { password: hashPassword },
            });
        } else {
            await prisma.customer.update({
                where: { email: email },
                data: { password: hashPassword },
            });
        }
    },
};
