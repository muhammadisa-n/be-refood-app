import express from "express"
import cors from "cors"
import fileUpload from "express-fileupload"
import morgan from "morgan"
import "dotenv/config"
import router from "./routes/index.js"
import cookieParser from "cookie-parser"
const port = process.env.PORT || 5000
const app = express()
app.use(cors())
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json())
app.use(fileUpload())
app.use(express.static("public"))
app.use(router)
app.listen(port, () => {
  console.log(`Server is Running on port ${port} `)
})
