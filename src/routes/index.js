import express from 'express'
import AuthRoutes from './AuthRoutes.js'
import userRoutes from './UserRoutes.js'
import productRoutes from './ProductRoutes.js'
import sellerRoutes from './SellerRoutes.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server its Works  🚀 ',
        author: 'Muhammad Isa',
        status_code: 200,
    })
})

router.get('/api', (req, res) => {
    res.status(200).json({
        message: 'Api its Works, Welcome 🖐 ',
        author: 'Muhammad Isa',
        status_code: 200,
    })
})
router.use('/api/', AuthRoutes)
router.use('/api/', userRoutes)
router.use('/api/', productRoutes)
router.use('/api/', sellerRoutes)
router.use('*', (req, res) => {
    res.status(404).json({
        message: 'Request Not Found, Bad Request',
        status_code: 404,
    })
})
export default router
