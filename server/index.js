import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { router as apiRouter } from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const prisma = new PrismaClient();

// ===========================================================================
// Auto-sync de tasas de cambio al arrancar el servidor
// Garantiza que las tasas en la BD siempre sean correctas (COP = 3200 por 1 USD, VES = 1066 por 1 USD)
// ===========================================================================
(async () => {
  const RATES = {
    VES: 1066,
    COP: 3200,
  };
  for (const [code, value] of Object.entries(RATES)) {
    try {
      await prisma.exchangeRate.upsert({
        where: { currencyCode: code },
        update: { rateToUsd: value },
        create: { currencyCode: code, rateToUsd: value },
      });
      console.log(`💱 Tasa ${code}: ${value} (auto-sync exitoso)`);
    } catch (err) {
      console.warn(`⚠️ No se pudo sincronizar tasa ${code}: ${err.message}`);
    }
  }
})();

const app = express();
const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: function (origin, callback) {
    // Permitir cualquier origen de Vercel (incluye preview deployments), localhost, y el propio Render
    const allowed = !origin || origin.endsWith('.vercel.app') || origin === 'https://veterinariamariangel.onrender.com' || origin.startsWith('http://localhost');
    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Logger simple
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Export prisma en req para las rutas
app.use((req, _res, next) => {
  req.prisma = prisma;
  next();
});

// API Routes
app.use('/api', apiRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'veterinaria-server', time: new Date().toISOString() });
});

// Serve static client in production (Render)
if (isProduction) {
  const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDistPath));
  // SPA fallback — todas las rutas no-API van a index.html
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return;
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
  console.log(`📦 Sirviendo frontend estático desde: ${clientDistPath}`);
}

app.listen(PORT, () => {
  console.log(`\n🏥 Servidor de Clínica Veterinaria + Marketplace activo en http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Modo: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
});
