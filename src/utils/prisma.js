import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const connectDatabase = async () => {
    try {
        await prisma.$connect()
        console.log('Successfully connected to the database.')
    } catch (error) {
        console.error('Error : ', error.message)
    }
}
export default prisma
