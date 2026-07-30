import express from 'express';
import cors from 'cors';
import { router } from '../server/routes/api.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

export default app;