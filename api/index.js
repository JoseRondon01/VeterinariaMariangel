const express = require('express');
const cors = require('cors');
const { router } = require('../server/routes/api');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.get('/health', (_req, res) => res.json({ status: 'or' }));

module.exports = app;