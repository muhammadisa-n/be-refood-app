import prisma from '../utils/prisma.js'

export const getAllCategory = async (req, res) => {
    try {
        const category = await prisma.category.findMany()
        return res.status(200).json({
            message: 'All Data Category Found',
            category,
            amount: category.length,
            status_code: 200,
        })
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
