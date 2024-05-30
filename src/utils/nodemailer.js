import nodemailer from 'nodemailer'
import 'dotenv/config'
const transporter = nodemailer.createTransport({
    services: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    logger: true, // log to console
    debug: true, // include SMTP traffic in the logs
})
transporter.verify((error, success) => {
    if (error) {
        console.error(error)
    } else {
        console.log('Server is ready to take our messages:', success)
    }
})
export default transporter
