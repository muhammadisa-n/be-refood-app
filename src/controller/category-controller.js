import prisma from '../utils/prisma.js'

export const getAllCategory = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'desc' },
        })
        const totalCategory = await prisma.category.count()
        res.status(200).json({
            message: 'Success Get  Category',
            categories,
            total_category: totalCategory,
            status_code: 200,
        })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
