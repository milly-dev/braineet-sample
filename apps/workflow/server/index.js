/* eslint-disable consistent-return */
const express = require('express');
const next = require('next');

require('dotenv').config({
    path: `env/.env.${process.env.NODE_ENV || 'development'}`,
});
const helmet = require('helmet');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use(helmet());

    server.use(helmet.dnsPrefetchControl({ allow: true }));

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, err => {
        if (err) throw err;
        console.info(`> Ready on http://localhost:${port}`);
    });
});
