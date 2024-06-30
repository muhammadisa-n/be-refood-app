require('dotenv/config');
const midtransClient = require('midtrans-client');

const snapMidtrans = new midtransClient.Snap({
    isProduction: false,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
});
module.exports = snapMidtrans;
