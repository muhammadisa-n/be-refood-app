require('dotenv/config');
const { prisma } = require('../utils/prisma.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    forgotPasswordValidation,
    emailValidation,
    loginValidation,
    registerValidation,
} = require('../validation/auth-validation.js');
const transporter = require('../utils/nodemailer.js');
const mustache = require('mustache');
const fs = require('fs');
const path = require('path');
module.exports = {
    register: async (req, res) => {
        const validate = registerValidation.validate(req.body, {
            allowUnknown: false,
        });
        if (validate.error) {
            let errors = validate.error.message;
            return res
                .status(400)
                .json({ message: `${errors}`, status_code: 400 });
        }
        try {
            const {
                nama,
                email,
                password,
                provinsi,
                kota,
                kecamatan,
                kelurahan,
                kode_pos,
                alamat,
                no_hp,
                role,
            } = validate.value;
            const checkUser = await prisma.$transaction([
                prisma.admin.findUnique({ where: { email } }),
                prisma.seller.findUnique({ where: { email } }),
                prisma.customer.findUnique({ where: { email } }),
                prisma.seller.findUnique({ where: { no_hp } }),
                prisma.customer.findUnique({ where: { no_hp } }),
            ]);
            if (checkUser[0] || checkUser[1] || checkUser[2]) {
                return res.status(409).json({
                    message: 'Email Telah Terdaftar',
                    status_code: 409,
                });
            }

            if (checkUser[3] || checkUser[4]) {
                return res.status(409).json({
                    message: 'Nomor HP Telah Terdaftar',
                    status_code: 409,
                });
            }
            const salt = 10;
            const hashPassword = await bcrypt.hash(password, salt);

            const verifyEmailToken = jwt.sign(
                { email: email, role: role },
                process.env.TOKEN_SECRET,
                { expiresIn: '1h' }
            );

            const url = `${process.env.CLIENT_URL}/verification-email?token=${verifyEmailToken}`;

            const template = fs.readFileSync(
                path.join(__dirname, '../templates/verify-email.mustache'),
                'utf-8'
            );

            const data = { url, name: nama };
            const verifyEmailTemplate = mustache.render(template, data);
            const mailOptions = {
                from: process.env.MAIL_FROM,
                to: email,
                subject: 'Email Verification',
                html: verifyEmailTemplate,
            };

            transporter.sendMail(mailOptions);
            const dataRegister = {
                nama: nama,
                email: email,
                password: hashPassword,
                provinsi: provinsi,
                kota: kota,
                kecamatan: kecamatan,
                kelurahan: kelurahan,
                kode_pos: kode_pos,
                alamat: alamat,
                no_hp: no_hp,
                verified_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            };
            if (role === 'Seller') {
                await prisma.seller.create({
                    data: dataRegister,
                });
            } else {
                await prisma.customer.create({
                    data: dataRegister,
                });
            }
            return res.status(201).json({
                message: 'Registrasi Berhasil, Cek Email Untuk Verifikasi',
                status_code: 201,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    login: async (req, res) => {
        const validate = loginValidation.validate(req.body, {
            allowUnknown: false,
        });
        if (validate.error) {
            let errors = validate.error.message;
            return res
                .status(400)
                .json({ message: `${errors}`, status_code: 400 });
        }
        const { email, password } = validate.value;
        let user;
        let role;
        try {
            const [admin, seller, customer] = await prisma.$transaction([
                prisma.admin.findUnique({ where: { email } }),
                prisma.seller.findUnique({ where: { email } }),
                prisma.customer.findUnique({ where: { email } }),
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
                return res.status(401).json({
                    message: 'Email Tidak Terdaftar',
                    status_code: 401,
                });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({
                    message: 'Password Salah',
                    status_code: 401,
                });
            }

            if (!user.verified_at) {
                return res.status(401).json({
                    message: 'Email Belum Diverifikasi',
                    status_code: 401,
                });
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
                    expiresIn: '20m',
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
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({
                message: 'Login Sukses',
                access_token,
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    logout: async (req, res) => {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken)
            return res.status(401).json({
                message: 'Unauthorized, Kamu Harus Login',
                status_code: 401,
            });

        let user;
        let role;
        try {
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
            if (!user)
                return res.status(401).json({
                    message: 'Unauthorized, Kamu Harus Login',
                    status_code: 401,
                });
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
            res.clearCookie('refresh_token');
            return res
                .status(200)
                .json({ message: 'Logout Berhasil', status_code: 200 });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    getAccessToken: async (req, res) => {
        try {
            const refreshToken = req.cookies.refresh_token;
            if (!refreshToken)
                return res.status(401).json({
                    message: 'Unauthorized, Kamu Harus Login',
                    status_code: 401,
                });
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
            if (!user)
                return res.status(401).json({
                    message: 'Unauthorized, Kamu Harus Login',
                    status_code: 401,
                });
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err) => {
                    if (err)
                        return res.status(401).json({
                            message:
                                'Unauthorized, Token Tidak Valid Atau Kadaluarsa',
                            status_code: 401,
                        });
                }
            );
            const payload = {
                user_id: user.id,
                user_email: user.email,
                user_name: user.nama,
                user_role: role,
            };
            const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '20m',
                }
            );
            return res.status(200).json({
                message: 'Sukses',
                accessToken,
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    verifyEmail: async (req, res) => {
        const token = req.query.token;
        if (!token) {
            return res.status(404).json({
                message: 'Params Query Token Tidak Ada',
                status_code: 404,
            });
        }
        try {
            jwt.verify(token, process.env.TOKEN_SECRET, async (err, data) => {
                if (err) {
                    return res.status(401).json({
                        message:
                            'Unauthorized, Token Tidak Valid Atau Kadaluarsa',
                        status_code: 401,
                    });
                }
                const { email, role } = data;
                let user;
                const [admin, seller, customer] = await prisma.$transaction([
                    prisma.admin.findFirst({ where: { email } }),
                    prisma.seller.findFirst({ where: { email } }),
                    prisma.customer.findFirst({ where: { email } }),
                ]);
                if (role === 'Admin') {
                    user = admin;
                } else if (role === 'Seller') {
                    user = seller;
                } else {
                    user = customer;
                }
                if (user.verified_at) {
                    return res.status(200).json({
                        message: 'Email Sudah Terverifikasi',
                        status_code: 200,
                    });
                }
                if (role === 'Admin') {
                    await prisma.admin.update({
                        where: { email: email },
                        data: { verified_at: new Date() },
                    });
                } else if (role === 'Seller') {
                    await prisma.seller.update({
                        where: { email: email },
                        data: { verified_at: new Date() },
                    });
                } else {
                    await prisma.customer.update({
                        where: { email: email },
                        data: { verified_at: new Date() },
                    });
                }
                return res.status(200).json({
                    message: 'Verifikasi Email Berhasil',
                    status_code: 200,
                });
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    requestForgotPassword: async (req, res) => {
        const validate = emailValidation.validate(req.body.email, {
            allowUnknown: false,
        });
        if (validate.error) {
            let errors = validate.error.message;
            return res
                .status(400)
                .json({ message: `${errors}`, status_code: 400 });
        }
        try {
            const email = validate.value;
            let user;
            let role;
            const [admin, seller, customer] = await prisma.$transaction([
                prisma.admin.findFirst({ where: { email } }),
                prisma.seller.findFirst({ where: { email } }),
                prisma.customer.findFirst({ where: { email } }),
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
                return res.status(404).json({
                    message: 'Email Tidak Terdaftar',
                    status_code: 404,
                });
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
            const data = { url, name: user.nama };
            const forgotPasswordTemplate = mustache.render(template, data);
            const mailOptions = {
                from: process.env.MAIL_FROM,
                to: email,
                subject: 'Reset Your Password',
                html: forgotPasswordTemplate,
            };
            transporter.sendMail(mailOptions);
            return res.status(200).json({
                message:
                    'Email Reset Password Berhasil Dikirim. Cek Email Untuk Reset Password.',
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    verifyForgotPassword: async (req, res) => {
        const token = req.query.token;
        if (!token) {
            return res.status(404).json({
                message: 'Params Query Token Tidak Ada',
                status_code: 404,
            });
        }
        try {
            jwt.verify(token, process.env.TOKEN_SECRET, async (err, data) => {
                if (err) {
                    return res.status(401).json({
                        message:
                            'Unauthorized, Token Tidak Valid Atau Kadaluarsa',
                        status_code: 401,
                    });
                }
                const validate = forgotPasswordValidation.validate(req.body, {
                    allowUnknown: false,
                });
                if (validate.error) {
                    let errors = validate.error.message;
                    return res
                        .status(400)
                        .json({ message: `${errors}`, status_code: 400 });
                }
                const { email, role } = data;
                const { password } = validate.value;

                const salt = 10;
                const hashPassword = await bcrypt.hash(password, salt);
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
                return res.status(200).json({
                    message: 'Reset Password Berhasil',
                    status_code: 200,
                });
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
};
