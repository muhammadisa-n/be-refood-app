const { prisma } = require('../utils/prisma.js');
const cloudinary = require('../utils/cloudinary.js');
const { productValidation } = require('../validation/product-validation.js');
const {
    VerificationSellerValidation,
} = require('../validation/seller-validation.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    getAllProduct: async (req, res) => {
        const page = Number(req.query.page) || 1;
        const take = Number(req.query.take) || 10;
        const skip = (page - 1) * take;
        const filters = [];
        filters.push({
            seller_id: req.userData.user_id,
        });
        if (req.query.search) {
            filters.push({
                nama: {
                    contains: req.query.search,
                },
            });
        }
        try {
            const products = await prisma.product.findMany({
                where: { AND: filters },
                take: take,
                skip: skip,
                orderBy: { updated_at: 'desc' },
                include: {
                    Category: { select: { nama: true } },
                },
            });
            const totalProduct = await prisma.product.count({
                where: {
                    AND: filters,
                },
            });
            res.status(200).json({
                message: 'Sukses',
                products,
                total_product: totalProduct,
                paging: {
                    current_page: page,
                    total_page: Math.ceil(totalProduct / take),
                },
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    getDetailProduct: async (req, res) => {
        try {
            const product = await prisma.product.findFirst({
                where: { id: req.params.id },
                include: {
                    Category: { select: { nama: true } },
                },
            });
            if (!product)
                return res.status(404).json({
                    message: 'Data Product Tidak Ditemukan',
                    status_code: 404,
                });
            return res.status(200).json({
                message: 'Data Product Ditemukan',
                product,
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    countProduct: async (req, res) => {
        try {
            const totalProduct = await prisma.product.count({
                where: { seller_id: req.userData.user_id },
            });
            res.status(200).json({
                message: 'Sukses',
                total_product: totalProduct,
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    createProduct: async (req, res) => {
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                message: 'Tidak Ada Image Diupload',
                status_code: 400,
            });
        }
        const seller = await prisma.seller.findFirst({
            where: { id: req.userData.user_id },
        });
        if (seller.is_active === false) {
            return res.status(403).json({
                message: 'Akses Terlarang, Akun Anda Belum Aktif',
                status_code: 403,
            });
        }
        const validate = productValidation.validate(req.body, {
            allowUnknown: false,
        });
        if (validate.error) {
            let errors = validate.error.message;
            return res
                .status(400)
                .json({ message: `${errors}`, status_code: 400 });
        }
        const file = req.files.image;
        const fileSize = file.size;
        const ext = path.extname(file.name);
        const allowedType = ['.png', '.jpg', '.jpeg'];
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
            console.log(imageFile);
            return res.status(422).json({
                message: 'File Image Terlalu Besar, Maksimal 5MB',
                status_code: 422,
            });
        }
        try {
            const result = await cloudinary.uploader.upload(imageFile, {
                folder: `products/images/${req.userData.user_id}`,
                unique_filename: true,
                tags: `product-image`,
            });
            fs.unlinkSync(imageFile);
            const { nama, deskripsi, harga, category_id } = validate.value;
            await prisma.product.create({
                data: {
                    nama: nama,
                    deskripsi: deskripsi,
                    harga: harga,
                    category_id: category_id,
                    image_id: result.public_id,
                    image_url: result.secure_url,
                    seller_id: req.userData.user_id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            return res.status(201).json({
                message: 'Data Produk Berhasil Ditambah',
                status_code: 201,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    updateProduct: async (req, res) => {
        const seller = await prisma.seller.findFirst({
            where: { id: req.userData.user_id },
        });
        if (seller.is_active === false) {
            return res.status(403).json({
                message: 'Akses Terlarang, Akun Anda Belum Aktif',
                status_code: 403,
            });
        }
        const validate = productValidation.validate(req.body, {
            allowUnknown: true,
        });
        if (validate.error) {
            let errors = validate.error.message;
            return res
                .status(400)
                .json({ message: `${errors}`, status_code: 400 });
        }
        const product = await prisma.product.findFirst({
            where: { id: req.params.id, seller_id: req.userData.user_id },
        });
        if (!product)
            return res.status(404).json({
                message: 'Data Product Tidak Ditemukan',
                status_code: 404,
            });
        let imageId;
        let imageUrl;
        if (req.files === null) {
            imageId = product.image_id;
            imageUrl = product.image_url;
        } else if (req.files.image) {
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
                    message: 'File Image Terlalu Besar, Maksimal 5MB',
                    status_code: 422,
                });
            }
            await cloudinary.uploader.destroy(product.image_id);
            const result = await cloudinary.uploader.upload(imageFile, {
                folder: `products/images/${req.userData.user_id}`,
                unique_filename: true,
                tags: `product-image`,
            });
            fs.unlinkSync(imageFile);
            imageId = result.public_id;
            imageUrl = result.secure_url;
        }
        try {
            const { nama, deskripsi, harga, category_id } = validate.value;
            await prisma.product.update({
                where: { id: req.params.id },
                data: {
                    nama: nama,
                    deskripsi: deskripsi,
                    harga: harga,
                    category_id: category_id,
                    image_id: imageId,
                    image_url: imageUrl,
                    updated_at: new Date(),
                },
            });
            return res.status(200).json({
                message: 'Data Produk Berhasil Diubah',
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    deleteProduct: async (req, res) => {
        const seller = await prisma.seller.findFirst({
            where: { id: req.userData.user_id },
        });
        if (seller.is_active === false) {
            return res.status(403).json({
                message: 'Akses Terlarang, Akun Anda Belum Aktif',
                status_code: 403,
            });
        }
        const product = await prisma.product.findFirst({
            where: { id: req.params.id, seller_id: req.userData.user_id },
        });

        if (!product)
            return res.status(404).json({
                message: 'Data Produk Tidak Ditemukan',
                status_code: 404,
            });

        const [ProductUsedCart, ProductUsedOrder] = await prisma.$transaction([
            prisma.cart.findMany({ where: { product_id: product.id } }),
            prisma.order.findMany({ where: { product_id: product.id } }),
        ]);
        if (ProductUsedCart.length > 0 || ProductUsedOrder > 0) {
            return res.status(409).json({
                message:
                    'Tidak Dapat Menghapus Data Produk. Ada Yang Terhubung Ke Produk Ini',
                status_code: 409,
            });
        }
        try {
            await cloudinary.uploader.destroy(product.image_id);
            await prisma.product.delete({
                where: { id: req.params.id, seller_id: req.userData.user_id },
            });
            return res.status(200).json({
                message: 'Data Produk Berhasil Dihapus',
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    verifySeller: async (req, res) => {
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                message: 'Tidak Ada Image Diupload',
                status_code: 400,
            });
        }
        const validate = VerificationSellerValidation.validate(req.body, {
            allowUnknown: false,
        });
        if (validate.error) {
            let errors = validate.error.message;
            return res
                .status(400)
                .json({ message: `${errors}`, status_code: 400 });
        }
        const file = req.files.image;
        const fileSize = file.size;
        const ext = path.extname(file.name);
        const allowedType = ['.png', '.jpg', '.jpeg'];
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
            console.log(imageFile);
            return res.status(422).json({
                message: 'File Terlalu Besar Maksimal 5MB',
                status_code: 422,
            });
        }
        const seller = await prisma.seller.findFirst({
            where: { id: req.userData.user_id },
        });
        if (seller.sample_image_product_id !== null) {
            try {
                await cloudinary.uploader.destroy(
                    seller.sample_image_product_id
                );
            } catch (error) {
                return res
                    .status(500)
                    .json({ message: `${error.message}`, status_code: 500 });
            }
        }
        try {
            const result = await cloudinary.uploader.upload(imageFile, {
                folder: `products/images/${req.userData.user_id}/sample-products`,
                unique_filename: true,
                tags: `sample-product-image`,
            });
            fs.unlinkSync(imageFile);

            const { link_map } = validate.value;
            await prisma.seller.update({
                where: { id: req.userData.user_id },
                data: {
                    link_map_alamat_toko: link_map,
                    sample_image_product_id: result.public_id,
                    sample_image_product_url: result.secure_url,
                },
            });
            return res
                .status(200)
                .json({ message: 'Sukses', status_code: 200 });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
};
