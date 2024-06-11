import prisma from '../utils/prisma.js'

export const getAllCategory = async (req, res) => {
    let take = Number(req.query.take) || 0
    let skip = Number(req.query.skip) || 0
    try {
        if (take) {
            const category = await prisma.category.findMany({
                take,
                skip,
            })
            let lastCategory = category[take - 1]
            const myCursor = lastCategory.id
            if (!category)
                return res.status(200).json({
                    message: 'Data Category is Empty',
                    category,
                    amount: category.length,
                    status_code: 200,
                })
            res.status(200).json({
                message: 'All Data Category Found',
                category,
                cursor: myCursor,
                amount: category.length,
                status_code: 200,
            })
        } else {
            const category = await prisma.category.findMany({})
            if (!category)
                return res.status(200).json({
                    message: 'Data Category is Empty',
                    category,
                    amount: category.length,
                    status_code: 200,
                })
            res.status(200).json({
                message: 'All Data Category Found',
                category,
                amount: category.length,
                status_code: 200,
            })
        }
    } catch (error) {
        return res
            .status(501)
            .json({ message: `${error.message}`, status_code: 501 })
    }
}
