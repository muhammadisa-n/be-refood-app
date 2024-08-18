const moment = require('moment-timezone');
const localTime = moment().tz('Asia/Jakarta').format();
console.log(localTime);
