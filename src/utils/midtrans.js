require('dotenv/config');
const midtransClient = require('midtrans-client');

clientKey = process.env.MIDTRANS_CLIENT_KEY;
serverKey = process.env.MIDTRANS__SERVER_KEY;

const snapMidtrans = new midtransClient.Snap({
    isProduction: false,
    serverKey: serverKey,
    clientKey: clientKey,
});
module.exports = snapMidtrans;
