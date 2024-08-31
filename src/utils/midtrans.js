require('dotenv/config');
const midtransClient = require('midtrans-client');
const isProduction = process.env.NODE_ENV === 'production';
const snapMidtrans = new midtransClient.Snap({
    isProduction: isProduction,
    clientKey: isProduction
        ? process.env.PROD_MIDTRANS_CLIENT_KEY
        : process.env.DEV_MIDTRANS_CLIENT_KEY,
    serverKey: isProduction
        ? process.env.PROD_MIDTRANS_SERVER_KEY
        : process.env.DEV_MIDTRANS_SERVER_KEY,
});
module.exports = snapMidtrans;
