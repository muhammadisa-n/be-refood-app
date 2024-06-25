import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import 'dotenv/config'
import router from './routes/index.js'
import cookieParser from 'cookie-parser'
import { connectDatabase } from './utils/prisma.js'

const port = process.env.PORT_APP || 5000
const app = express()
const clientUrl = process.env.CLIENT_URL
app.use(
    cors({
        credentials: true,
        origin: [clientUrl],
    })
)
connectDatabase()
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(fileUpload({ useTempFiles: true, tempFileDir: './temp/' }))
app.use(express.static('public'))
app.use(router)
app.listen(port, () => {
    console.log(`Server is Running on port ${port} `)
})
