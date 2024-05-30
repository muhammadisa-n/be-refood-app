import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import 'dotenv/config'
import router from './routes/index.js'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerDoc from './utils/apiDocs.js'
const port = process.env.PORT_APP || 5000
const clientUrl = process.env.CLIENT_URL
import transporter from './utils/nodemailer.js'
const app = express()
const options = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Refood Restfull API Documentation',
}
app.use(
    cors({
        credentials: true,
        origin: clientUrl,
    })
)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, options))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(fileUpload())
app.use(express.static('public'))
app.use(router)
app.listen(port, () => {
    console.log(`Server is Running on port ${port} `)
})
