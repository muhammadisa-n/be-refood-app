const { prisma } = require('../utils/prisma.js');
module.exports = {
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
        try {
            const product = await prisma.product.findUnique({
                where: { id: req.params.id },
                include: {
                    Category: true,
                    Seller: true,
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
};
