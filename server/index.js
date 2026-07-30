import express from 'express';
import cors from 'cors';
import { router as apiRouter } from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Logger simple
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.use('/api', apiRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'veterinaria-server', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🏥 Servidor de Clínica Veterinaria activo en http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});