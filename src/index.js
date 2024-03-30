require('dotenv').config();
const express = require('express');
const { Router } = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routeInitialization = require('./routes/config.js');
const authentication = require('./middleware/authentication');

const logger = require('./services/logs.service');
const disabled_logs = process.env.DISABLED_LOGS;
const { logs } = require('./middleware/logs.js');

const app = express();

async function start() {
    try {
        const allowedOrigins = [process.env.FRONTEND_ORIGIN];

        const options = {
            allowedOrigins: allowedOrigins,
            methods: 'GET, POST, PUT, DELETE',
            allowedHeaders: 'Content-Type, Authorization'
        };

        const router = Router();
        const routes = routeInitialization(router, authentication);

        app.use(bodyParser.json());
        app.use(cors(options));
        app.use(!disabled_logs ? logs : null);
        app.use(routes);

        app.listen(9999);

        console.log(logger.success('Connection established!'));
    } catch (err) {
        console.error(`[Server Error] - ${err.message}`);
    }
}

start();
exports.start = start;
module.exports = app;
