const { prisma } = require('../utils/prisma.js');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary.js');
const { updateUserValidation } = require('../validation/user-validation.js');
module.exports = {
    getUser: async (req, res) => {
        try {
            let user;
            const { user_id, user_role } = req.userData;
            if (user_role === 'Admin') {
                user = await prisma.admin.findUnique({
                    where: { id: user_id },
                });
            } else if (user_role === 'Seller') {
                user = await prisma.seller.findUnique({
                    where: { id: user_id },
                });
            } else if (user_role === 'Customer') {
                user = await prisma.customer.findUnique({
                    where: { id: user_id },
                });
            }
            if (!user)
                return res.status(404).json({
                    message: 'Data User Tidak Ditemukan',
                    user,
                    status_code: 404,
                });
            return res.status(200).json({
                message: 'Data User Ditemukan',
                user,
                role: user_role,
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    updateUser: async (req, res) => {
        const { user_id, user_role } = req.userData;
        const validate = updateUserValidation.validate(req.body, {
            allowUnknown: true,
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
                deskripsi,
                provinsi,
                kota,
                kecamatan,
                kelurahan,
                kode_pos,
                alamat,
                no_hp,
            } = validate.value;
            let user;
            if (user_role === 'Admin') {
                user = await prisma.admin.findUnique({
                    where: { id: user_id },
                });
            } else if (user_role === 'Seller') {
                user = await prisma.seller.findUnique({
                    where: { id: user_id },
                });
            } else {
                user = await prisma.customer.findUnique({
                    where: { id: user_id },
                });
            }
            if (!user)
                return res.status(404).json({
                    message: 'User Not Found',
                    user,
                    status_code: 404,
                });

            if (no_hp && no_hp !== user.no_hp) {
                const [checkSellerNoHP, checkCustomerNoHP] =
                    await prisma.$transaction([
                        prisma.seller.findFirst({
                            where: {
                                no_hp: no_hp,
                                id: { not: user_id },
                            },
                        }),
                        prisma.customer.findFirst({
                            where: {
                                no_hp: no_hp,
                                id: { not: user_id },
                            },
                        }),
                    ]);

                if (checkSellerNoHP || checkCustomerNoHP) {
                    return res.status(409).json({
                        message: 'Nomor HP Telah Terdaftar',
                        status_code: 409,
                    });
                }
            }

            let imageId = user.ava_image_id;
            let imageUrl = user.ava_image_url;
            if (req.files && req.files.image) {
                const file = req.files.image;
                const fileSize = file.size;
                const ext = path.extname(file.name);
                const allowedType = ['.png', '.jpeg', '.jpg'];
                const imageFile = file.tempFilePath;
                if (!allowedType.includes(ext.toLowerCase())) {
                    fs.unlinkSync(imageFile);
                    return res.status(422).json({
                        message: 'Format Image Tidak Valid',
                        status_code: 422,
                    });
                }
                if (fileSize > 5 * 1024 * 1024) {
                    fs.unlinkSync(imageFile);
                    return res.status(422).json({
                        message: 'File Terlalu Besar Maksimal 5MB',
                        status_code: 422,
                    });
                }
                if (user.ava_image_id !== null) {
                    await cloudinary.uploader.destroy(user.ava_image_id);
                }
                const result = await cloudinary.uploader.upload(imageFile, {
                    folder: `user/images/${req.userData.user_id}`,
                    unique_filename: true,
                    tags: `user-image`,
                });
                fs.unlinkSync(imageFile);
                imageId = result.public_id;
                imageUrl = result.secure_url;
            }

            if (user_role === 'Admin') {
                await prisma.admin.update({
                    where: { id: user_id },
                    data: {
                        nama: nama,
                        ava_image_id: imageId,
                        ava_image_url: imageUrl,
                    },
                });
            } else if (user_role === 'Seller') {
                await prisma.seller.update({
                    where: { id: req.userData.user_id },
                    data: {
                        nama: nama || user.nama,
                        deskripsi: deskripsi || user.deskripsi,
                        provinsi: provinsi || user.provinsi,
                        kota: kota || user.kota,
                        kecamatan: kecamatan || user.kecamatan,
                        kelurahan: kelurahan || user.kelurahan,
                        kode_pos: kode_pos || user.kode_pos,
                        alamat: alamat || user.alamat,
                        no_hp: no_hp || user.no_hp,
                        ava_image_id: imageId,
                        ava_image_url: imageUrl,
                        updated_at: new Date(),
                    },
                });
            } else {
                await prisma.customer.update({
                    where: { id: req.userData.user_id },
                    data: {
                        nama: nama || user.nama,
                        provinsi: provinsi || user.provinsi,
                        kota: kota || user.kota,
                        kecamatan: kecamatan || user.kecamatan,
                        kelurahan: kelurahan || user.kelurahan,
                        kode_pos: kode_pos || user.kode_pos,
                        alamat: alamat || user.alamat,
                        no_hp: no_hp || user.no_hp,
                        ava_image_id: imageId,
                        ava_image_url: imageUrl,
                        updated_at: new Date(),
                    },
                });
            }
            return res.status(200).json({
                message: 'Data User Berhasil Diubah',
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
};
