const { prisma } = require('../utils/prisma.js');

module.exports = {
    getAllCategory: async (req, res) => {
        try {
            const categories = await prisma.category.findMany({
                orderBy: { updated_at: 'desc' },
            });
            const totalCategory = await prisma.category.count();
            res.status(200).json({
                message: 'Sukses',
                categories,
                total_category: totalCategory,
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
};
