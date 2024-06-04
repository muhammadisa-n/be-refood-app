import prisma from '../utils/prisma.js'
export const getAllProduct = async (req, res) => {
    let take = Number(req.query.take) || 0
    let skip = Number(req.query.skip) || 0
    try {
        if (take) {
            const product = await prisma.product.findMany({
                where: { is_valid: true },
                take,
                skip,
                orderBy: { updated_at: 'desc' },
                include: {
                    Category: true,
                },
            })
            let lastProduct = product[take - 1]
            const myCursor = lastProduct.id
            if (product.length === 0)
                return res.status(200).json({
                    message: 'Data Product is Empty',
                    product,
                    amount: product.length,
                    status_code: 200,
                })
            res.status(200).json({
                message: 'All Data Product Found',
                product,
                cursor: myCursor,
                amount: product.length,
                status_code: 200,
            })
        } else {
            const product = await prisma.product.findMany({
                where: { is_valid: true },
                orderBy: { created_at: 'desc' },
                include: {
                    Category: true,
                },
            })
            if (product.length === 0)
                return res.status(200).json({
                    message: 'Data Product is Empty',
                    product,
                    amount: product.length,
                    status_code: 200,
                })
            res.status(200).json({
                message: 'All Data Product Found',
                product,
                amount: product.length,
                status_code: 200,
            })
        }
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
            .json({ message: 'Product not found', status_code: 404 })
    return res.status(200).json({ product, status_code: 200 })
}
