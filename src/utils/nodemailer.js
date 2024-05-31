import nodemailer from 'nodemailer'
import 'dotenv/config'
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    logger: true,
})
transporter.verify((error, success) => {
    if (error) {
        console.error(error)
    } else {
        console.log('Success Connect Nodemailer')
    }
})
export default transporter
