require('dotenv/config');
const midtransClient = require('midtrans-client');

const isProduction = process.env.NODE_ENV === 'production';
let clientKey, serverKey;
if (isProduction) {
    clientKey = process.env.PROD_CLIENT_KEY;
    serverKey = process.env.PROD_SERVER_KEY;
} else {
    clientKey = process.env.DEV_CLIENT_KEY;
    serverKey = process.env.DEV_SERVER_KEY;
}

const snapMidtrans = new midtransClient.Snap({
    isProduction: isProduction,
    serverKey: serverKey,
    clientKey: clientKey,
});
module.exports = snapMidtrans;
