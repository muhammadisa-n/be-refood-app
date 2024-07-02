require('dotenv/config');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const router = require('./routes/index.js');
const cookieParser = require('cookie-parser');
const { connectDatabase } = require('./utils/prisma.js');

const port = process.env.PORT_APP;
const app = express();
const clientUrl = process.env.CLIENT_URL;
const corsOption = {};
app.use(
    cors({
        origin: [clientUrl],
        credentials: true,
    })
);
connectDatabase();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: './temp/' }));
app.use(express.static('public'));
app.use(router);
app.listen(port, () => {
    console.log(`Server is Running on port ${port} `);
});
