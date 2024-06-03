import express from 'express'
import AuthRoutes from './AuthRoutes.js'
import userRoutes from './UserRoutes.js'
import productRoutes from './ProductRoutes.js'
import AdminRoutes from './AdminRoutes.js'
import SellerRoutes from './SellerRoutes.js'
import CategoryRoutes from './CategoryRoutes.js'
import CartRoutes from './CartRoutes.js'

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
router.use('/api/', AdminRoutes)
router.use('/api/', SellerRoutes)
router.use('/api/', CartRoutes)
router.use('/api/', CategoryRoutes)
router.use('/api/', userRoutes)
router.use('/api/', productRoutes)

router.use('*', (req, res) => {
    res.status(404).json({
        message: 'Request Not Found, Bad Request',
        status_code: 404,
    })
})
export default router
