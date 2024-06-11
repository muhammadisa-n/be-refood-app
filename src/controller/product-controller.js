import prisma from '../utils/prisma.js'
export const getAllProduct = async (req, res) => {
    const take = Number(req.query.take) || 8
    const skip = Number(req.query.skip) || 0
    try {
        const products = await prisma.product.findMany({
            where: { is_active: true },
            take,
            skip,
            orderBy: { updated_at: 'desc' },
            include: {
                Category: true,
            },
        })
        const totalProduct = await prisma.product.count()
        let cursor = products[take - 1]?.id
        res.status(200).json({
            message: 'Success Get All Product',
            products,
            cursor: cursor,
            totalProduct: totalProduct,
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
