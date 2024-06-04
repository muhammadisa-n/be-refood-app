import express from 'express'
import { getAllCategory } from '../controller/category-controller.js'
const categoryRoutes = express.Router()
categoryRoutes.get('/category', getAllCategory)
export default categoryRoutes
