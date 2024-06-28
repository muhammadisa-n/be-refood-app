const { prisma } = require('../utils/prisma.js');
const { categoryValidation } = require('../validation/category-validation.js');

module.exports = {
    // Products
    getAllProduct: async (req, res) => {
        const page = Number(req.query.page) || 1;
        const take = Number(req.query.take) || 10;
        const skip = (page - 1) * take;
        const filters = [];
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
        const product = await prisma.product.findUnique({
            where: { id: req.params.id },
        });

        if (!product) {
            return res
                .status(404)
                .json({ message: 'Data Produk Tidak Ada', status_code: 404 });
        }
        return res.status(200).json({
            message: 'Data Produk Ditemukan',
            product,
            status_code: 200,
        });
    },
    activateProduct: async (req, res) => {
        try {
            const product = await prisma.product.findFirst({
                where: { id: req.params.id },
            });
            if (!product) {
                return res.status(404).json({
                    message: 'Product Tidak Ditemukan',
                    status_code: 404,
                });
            }
            await prisma.product.update({
                where: { id: req.params.id },
                data: {
                    is_active: req.body.is_active,
                },
            });
            return res.status(200).json({
                message: 'Data Product Berhasil Diaktifkan',
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
            const totalProduct = await prisma.product.count();
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
    // Category
    getAllCategory: async (req, res) => {
        const page = Number(req.query.page) || 1;
        const take = Number(req.query.take) || 10;
        const skip = (page - 1) * take;

        const filters = [];
        if (req.query.search) {
            filters.push({
                nama: {
                    contains: req.query.search,
                },
            });
        }
        try {
            const categories = await prisma.category.findMany({
                where: { AND: filters },
                take: take,
                skip: skip,
                orderBy: { id: 'asc' },
            });
            const totalCategory = await prisma.category.count({
                where: {
                    AND: filters,
                },
            });
            res.status(200).json({
                message: 'Sukses',
                categories,
                total_category: totalCategory,
                paging: {
                    current_page: page,
                    total_page: Math.ceil(totalCategory / take),
                },
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    createCategory: async (req, res) => {
        const validate = categoryValidation.validate(req.body, {
            allowUnknown: false,
        });
        if (validate.error) {
            let errors = validate.error.message;
            return res
                .status(400)
                .json({ message: `${errors}`, status_code: 400 });
        }

        try {
            const { nama } = validate.value;
            await prisma.category.create({
                data: {
                    nama: nama,
                },
            });
            return res.status(201).json({
                message: 'Data Kategori Berhasil Ditambah',
                status_code: 201,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    getDetailCategory: async (req, res) => {
        const category = await prisma.category.findUnique({
            where: { id: Number(req.params.id) },
        });

        if (!category) {
            return res
                .status(404)
                .json({ message: 'Data Kategori Tidak Ada', status_code: 404 });
        }
        return res.status(200).json({
            message: 'Data Kategori Ditemukan',
            category,
            status_code: 200,
        });
    },
    updateCategory: async (req, res) => {
        const validate = categoryValidation.validate(req.body, {
            allowUnknown: false,
        });
        if (validate.error) {
            let errors = validate.error.message;
            return res
                .status(400)
                .json({ message: `${errors}`, status_code: 400 });
        }
        const category = await prisma.category.findFirst({
            where: { id: Number(req.params.id) },
        });
        if (!category)
            return res
                .status(404)
                .json({ message: 'Data Kategori Tidak Ada', status_code: 404 });

        try {
            const { nama } = validate.value;
            await prisma.category.update({
                where: { id: Number(req.params.id) },
                data: {
                    nama: nama,
                },
            });
            return res.status(200).json({
                message: 'Data Kategori Berhasil Diubah',
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    deleteCategory: async (req, res) => {
        const category_id = Number(req.params.id);
        if (isNaN(category_id)) {
            return res
                .status(404)
                .json({ message: 'Data Kategori Tidak Ada', status_code: 404 });
        }
        const category = await prisma.category.findUnique({
            where: { id: category_id },
        });

        if (!category)
            return res
                .status(404)
                .json({ message: 'Data Kategori Tidak Ada', status_code: 404 });
        const CategoryUsed = await prisma.product.findMany({
            where: {
                category_id: category_id,
            },
        });

        if (CategoryUsed.length > 0) {
            return res.status(409).json({
                message:
                    'Tidak Dapat Menghapus Data Kategori, Ada Produk Yang Terhubung Ke Kategori Ini',
                status_code: 409,
            });
        }
        try {
            await prisma.category.delete({
                where: { id: Number(req.params.id) },
            });
            return res.status(200).json({
                message: 'Data Kategori Berhasil Dihapus',
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    // Sellers
    getAllSeller: async (req, res) => {
        const page = Number(req.query.page) || 1;
        const take = Number(req.query.take) || 10;
        const skip = (page - 1) * take;
        const filters = [];
        if (req.query.search) {
            filters.push({
                nama: {
                    contains: req.query.search,
                },
            });
        }
        try {
            const sellers = await prisma.seller.findMany({
                where: { AND: filters },
                take: take,
                skip: skip,
                orderBy: { updated_at: 'desc' },
            });
            const totalSeller = await prisma.seller.count({
                where: {
                    AND: filters,
                },
            });
            res.status(200).json({
                message: 'Sukses',
                sellers,
                total_seller: totalSeller,
                paging: {
                    current_page: page,
                    total_page: Math.ceil(totalSeller / take),
                },
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    getDetailSeller: async (req, res) => {
        const seller = await prisma.seller.findUnique({
            where: { id: req.params.id },
        });

        if (!seller) {
            return res
                .status(404)
                .json({ message: 'Data Seller Tidak Ada', status_code: 404 });
        }
        return res.status(200).json({
            message: 'Data Seller Ditemukan',
            seller,
            status_code: 200,
        });
    },
    countSeller: async (req, res) => {
        try {
            const totalSeller = await prisma.seller.count();
            return res.status(200).json({
                message: 'Sukses',
                total_seller: totalSeller || 0,
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    activateSeller: async (req, res) => {
        try {
            const seller = await prisma.seller.findFirst({
                where: { id: req.params.id },
            });
            if (!seller) {
                return res.status(404).json({
                    message: 'Data Seller Tidak Ada',
                    status_code: 404,
                });
            }
            await prisma.seller.update({
                where: { id: req.params.id },
                data: {
                    is_active: req.body.is_active,
                },
            });
            return res.status(200).json({
                message: 'Seller Berhasil Diaktifkan',
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    // Customer
    getAllCustomer: async (req, res) => {
        const page = Number(req.query.page) || 1;
        const take = Number(req.query.take) || 10;
        const skip = (page - 1) * take;
        const filters = [];
        if (req.query.search) {
            filters.push({
                nama: {
                    contains: req.query.search,
                },
            });
        }
        try {
            const customers = await prisma.customer.findMany({
                where: { AND: filters },
                take: take,
                skip: skip,
                orderBy: { updated_at: 'desc' },
            });
            const totalCustomer = await prisma.customer.count({
                where: {
                    AND: filters,
                },
            });
            res.status(200).json({
                message: 'Sukses',
                customers,
                total_customer: totalCustomer,
                paging: {
                    current_page: page,
                    total_page: Math.ceil(totalCustomer / take),
                },
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    countCustomer: async (req, res) => {
        try {
            const totalCustomer = await prisma.customer.count();
            return res.status(200).json({
                message: 'Sukses',
                total_customer: totalCustomer,
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
};
