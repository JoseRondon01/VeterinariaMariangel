import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { router } from './routes/api.js';

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

// Logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Export prisma en req para las rutas
app.use((req, _res, next) => {
  req.prisma = prisma;
  next();
});

app.use('/api', router);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

export default app;