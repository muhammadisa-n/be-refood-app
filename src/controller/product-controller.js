import prisma from '../utils/prisma.js'
export const getAllProduct = async (req, res) => {
    const page = Number(req.query.page) || 1
    const skip = (page - 1) * Number(req.query.size)
    const filters = []
    filters.push({
        is_active: true,
    })
    if (req.query.search) {
        filters.push({
            name: {
                contains: req.query.search,
            },
        })
    }
    try {
        const products = await prisma.product.findMany({
            where: { AND: filters },
            take: Number(req.query.size),
            skip: skip,
            orderBy: { updated_at: 'desc' },
            include: {
                Category: { select: { name: true } },
            },
        })
        const totalProduct = await prisma.product.count({
            where: {
                AND: filters,
            },
        })
        res.status(200).json({
            message: 'Success Get  Product',
            products,
            total_product: totalProduct,
            paging: {
                current_page: page,
                total_page: Math.ceil(totalProduct / req.query.size),
            },
            status_code: 200,
        })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
export const getDetailProduct = async (req, res) => {
    const product = await prisma.product.findUnique({
        where: { id: req.params.id },
        include: {
            Category: true,
            Seller: true,
        },
    })
    if (!product)
        return res
            .status(404)
            .json({ message: 'Data Product Not Found', status_code: 404 })
    return res
        .status(200)
        .json({ message: 'Data Product Found', product, status_code: 200 })
}
