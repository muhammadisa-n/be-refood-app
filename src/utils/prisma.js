const { PrismaClient } = require('@prisma/client');
const moment = require('moment-timezone');
const prisma = new PrismaClient({
    // log: [
    //     {
    //         emit: 'stdout',
    //         level: 'query',
    //     },
    //     {
    //         emit: 'stdout',
    //         level: 'error',
    //     },
    //     {
    //         emit: 'stdout',
    //         level: 'info',
    //     },
    //     {
    //         emit: 'stdout',
    //         level: 'warn',
    //     },
    // ],
});

const connectDatabase = async () => {
    try {
        await prisma.$connect();
        console.log('Sukses Connect database.');
    } catch (error) {
        console.error('Error : ', error.message);
    }
};
module.exports = { prisma, connectDatabase };
