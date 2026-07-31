import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../index.js';

export const router = Router();

// ===========================================================================
// Middleware de autenticación JWT para rutas admin
// ===========================================================================

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'veterinaria2024';
const JWT_SECRET = process.env.JWT_SECRET || 'mariangel-vet-jwt-secret-key-2026-marketplace';

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminUser = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// ===========================================================================
// EXISTING: Datos en memoria para endpoints veterinarios (seed)
// ===========================================================================

const services = [
  {
    id: 'consultas',
    title: 'Consultas Generales',
    description: 'Evaluación clínica completa, diagnóstico y plan de tratamiento personalizado para tu mascota.',
    icon: 'stethoscope',
    features: ['Examen físico completo', 'Diagnóstico por imagen', 'Seguimiento veterinario'],
  },
  {
    id: 'cirugia',
    title: 'Cirugía y Traumatología',
    description: 'Quirófano equipado con tecnología de punta y monitoreo anestésico continuo para procedimientos seguros.',
    icon: 'scalpel',
    features: ['Cirugía general y blanda', 'Ortopedia', 'Monitoreo anestésico avanzado'],
  },
  {
    id: 'peluqueria',
    title: 'Peluquería y Estética',
    description: 'Baño, corte y cuidado estético con productos hipoalergénicos y personal certificado Fear Free.',
    icon: 'scissors',
    features: ['Baño médico', 'Corte de raza', 'Limpieza dental básica'],
  },
  {
    id: 'laboratorio',
    title: 'Laboratorio Clínico',
    description: 'Análisis de sangre, orina y coprológicos con resultados el mismo día para decisiones rápidas.',
    icon: 'flask',
    features: ['Hematología completa', 'Bioquímica', 'Coprología y citología'],
  },
  {
    id: 'exoticos',
    title: 'Animales Exóticos',
    description: 'Atención especializada para conejos, aves, reptiles y mascotas no convencionales.',
    icon: 'paw',
    features: ['Medicina de aves', 'Reptiles y anfibios', 'Pequeños mamíferos'],
  },
  {
    id: 'urgencias',
    title: 'Urgencias 24/7',
    description: 'Atención inmediata las 24 horas, los 365 días del año. Equipo de guardia siempre disponible.',
    icon: 'alert',
    features: ['Guardia permanente', 'UCI móvil', 'Reanimación y estabilización'],
  },
];

const team = [
  {
    id: 1,
    name: 'Dra. Mariangel Garcia',
    role: 'Directora Médica · Medicina General',
    specialty: 'Medicina Preventiva y Medicina Interna',
    experience: '15 años',
    certifications: ['Fear Free Certified', 'AAHA Member', 'Especialista en Medicina Felina'],
    bio: 'Fundadora y directora de Veterinaria Mariangel. Con más de 15 años de experiencia, ha dedicado su vida al cuidado integral de las mascotas, combinando la medicina preventiva con un trato cariñoso y personalizado.',
    image: '/dra-mariangel.png',
  },
  {
    id: 2,
    name: 'Dr. Mateo Herrera',
    role: 'Cirujano · Ortopedia',
    specialty: 'Cirugía de tejidos blandos y ortopedia',
    experience: '10 años',
    certifications: ['Cirugía Avanzada', 'AO Trauma Member'],
    bio: 'Especialista en procedimientos quirúrgicos de alta complejidad con enfoque mínimamente invasivo.',
    image: '/dra-mariangel.png',
  },
  {
    id: 3,
    name: 'Dra. Camila Torres',
    role: 'Médica de Animales Exóticos',
    specialty: 'Medicina de aves, reptiles y pequeños mamíferos',
    experience: '8 años',
    certifications: ['Exotic Animal Practice', 'Fear Free Certified'],
    bio: 'Referente regional en medicina de animales no convencionales y conservación.',
    image: '/dra-mariangel.png',
  },
  {
    id: 4,
    name: 'Dr. Sebastián Vega',
    role: 'Dermatología y Alergias',
    specialty: 'Dermatología veterinaria e inmunología',
    experience: '9 años',
    certifications: ['Dermatology Specialist', 'ISVD Member'],
    bio: 'Experto en diagnóstico y tratamiento de enfermedades de la piel y alergias crónicas.',
    image: '/dra-mariangel.png',
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Laura Méndez',
    pet: 'Max · Labrador 4 años',
    rating: 5,
    text: 'Salvaron a Max de una torsión gástrica a medianoche. La atención de urgencia fue impecable y el seguimiento, extraordinario.',
    avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
  },
  {
    id: 2,
    name: 'Carlos Pinto',
    pet: 'Michi · Gato Siamés 7 años',
    rating: 5,
    text: 'El enfoque Fear Free hizo que Michi no se estresara en su consulta. Por fin una veterinaria que entiende a los gatos.',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 3,
    name: 'Andrea Salas',
    pet: 'Rocky · Bulldog 6 años',
    rating: 5,
    text: 'Reservé la cita online en 3 pasos y me atendieron puntual. El equipo médico es transparente y muy profesional.',
    avatar: 'https://randomuser.me/api/portraits/women/52.jpg',
  },
  {
    id: 4,
    name: 'Jorge Núñez',
    pet: 'Luna · Coneja 2 años',
    rating: 5,
    text: 'Pocas veterinarias atienden conejos con tanta especialización. La Dra. Torres es una crack con animales exóticos.',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
];

const blog = [
  {
    id: 1,
    slug: 'vacunacion-cachorros-guia-completa',
    title: 'Vacunación de cachorros: la guía completa 2026',
    excerpt: 'Todo lo que debes saber sobre el calendario de vacunas para proteger a tu cachorro durante su primer año de vida.',
    category: 'Salud Preventiva',
    date: '2026-07-15',
    readingTime: '6 min',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=500&fit=crop',
    content: 'La vacunación es el pilar de la medicina preventiva en cachorros. El calendario inicia entre las 6 y 8 semanas...',
  },
  {
    id: 2,
    slug: 'signos-emergencia-veterinaria',
    title: '7 signos de emergencia veterinaria que no debes ignorar',
    excerpt: 'Aprende a identificar señales críticas que requieren atención veterinaria inmediata para salvar la vida de tu mascota.',
    category: 'Urgencias',
    date: '2026-07-10',
    readingTime: '5 min',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=500&fit=crop',
    content: 'Reconocer una emergencia a tiempo puede marcar la diferencia. Dificultad respiratoria, vómito persistente...',
  },
  {
    id: 3,
    slug: 'cuidado-dental-felino',
    title: 'Cuidado dental en gatos: más importante de lo que crees',
    excerpt: 'La enfermedad periodontal afecta al 70% de los gatos mayores de 3 años. Prevención y tratamiento.',
    category: 'Salud Preventiva',
    date: '2026-07-05',
    readingTime: '4 min',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dea?w=800&h=500&fit=crop',
    content: 'La salud dental felina es frecuentemente subestimada. Una higiene adecuada previene dolor crónico...',
  },
  {
    id: 4,
    slug: 'alimentacion-perros-senior',
    title: 'Alimentación para perros senior: claves de longevidad',
    excerpt: 'Cómo adaptar la dieta de tu perro mayor para mantener su calidad de vida y prevenir enfermedades crónicas.',
    category: 'Nutrición',
    date: '2026-06-28',
    readingTime: '7 min',
    image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&h=500&fit=crop',
    content: 'Los perros senior tienen necesidades nutricionales específicas. Proteínas de alta calidad, control calórico...',
  },
];

const species = [
  { id: 'perro', label: 'Perro', icon: '🐕' },
  { id: 'gato', label: 'Gato', icon: '🐈' },
  { id: 'conejo', label: 'Conejo', icon: '🐇' },
  { id: 'ave', label: 'Ave', icon: '🦜' },
  { id: 'reptil', label: 'Reptil', icon: '🦎' },
  { id: 'otro', label: 'Otro', icon: '🐾' },
];

const visitReasons = [
  'Consulta general',
  'Vacunación',
  'Urgencia',
  'Cirugía',
  'Peluquería',
  'Laboratorio',
  'Control dental',
  'Segunda opinión',
];

function generateTimeSlots() {
  const slots = [];
  const now = new Date();
  for (let d = 1; d <= 7; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    const iso = date.toISOString().split('T')[0];
    const hours = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'];
    slots.push({
      date: iso,
      label: date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
      hours,
    });
  }
  return slots;
}

const appointments = [];

// ===========================================================================
// RUTAS PÚBLICAS — Veterinaria (existentes)
// ===========================================================================

router.get('/services', (_req, res) => res.json(services));
router.get('/team', (_req, res) => res.json(team));
router.get('/testimonials', (_req, res) => res.json(testimonials));
router.get('/blog', (_req, res) => res.json(blog));

router.get('/blog/:slug', (req, res) => {
  const post = blog.find((p) => p.slug === req.params.slug);
  if (!post) return res.status(404).json({ error: 'Artículo no encontrado' });
  res.json(post);
});

router.get('/booking/species', (_req, res) => res.json(species));
router.get('/booking/reasons', (_req, res) => res.json(visitReasons));
router.get('/booking/slots', (_req, res) => res.json(generateTimeSlots()));

router.post('/appointments', (req, res) => {
  const { ownerName, phone, petName, speciesId, reason, date, time, notes } = req.body;
  if (!ownerName || !phone || !petName || !speciesId || !reason || !date || !time) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios',
      required: ['ownerName', 'phone', 'petName', 'speciesId', 'reason', 'date', 'time'],
    });
  }
  const appointment = {
    id: appointments.length + 1,
    ownerName,
    phone,
    petName,
    speciesId,
    reason,
    date,
    time,
    notes: notes || '',
    status: 'pendiente',
    createdAt: new Date().toISOString(),
  };
  appointments.push(appointment);
  console.log('✅ Nueva cita creada:', appointment);
  res.status(201).json({
    success: true,
    message: 'Cita registrada con éxito. Te contactaremos para confirmar.',
    appointment,
  });
});

router.get('/appointments', (_req, res) => res.json(appointments));

// ===========================================================================
// RUTAS PÚBLICAS — Marketplace
// ===========================================================================

// Productos activos
router.get('/products', async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Error al cargar productos' });
  }
});

// Categorías
router.get('/categories', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Error al cargar categorías' });
  }
});

// Tasas de cambio
router.get('/exchange-rates', async (_req, res) => {
  try {
    const rates = await prisma.exchangeRate.findMany();
    res.json(rates);
  } catch (err) {
    console.error('Error fetching exchange rates:', err);
    res.status(500).json({ error: 'Error al cargar tasas de cambio' });
  }
});

// Configuración de métodos de pago (pública, solo activos)
router.get('/payment-config', async (_req, res) => {
  try {
    const configs = await prisma.paymentConfig.findMany({
      where: { isActive: true },
    });
    res.json(configs);
  } catch (err) {
    console.error('Error fetching payment config:', err);
    res.status(500).json({ error: 'Error al cargar configuración de pagos' });
  }
});

// ===========================================================================
// RUTA: Crear orden (pedido)
// ===========================================================================

router.post('/orders/create', async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, selectedCurrency, paymentMethod, items, proofDetails } = req.body;

    // Validaciones básicas
    if (!customerName || !customerPhone || !paymentMethod || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: customerName, customerPhone, paymentMethod, items' });
    }

    const validMethods = ['pago_movil', 'zelle', 'cash_usd', 'cash_cop'];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({ error: 'Método de pago inválido' });
    }

    // Obtener tasas de cambio para calcular total en moneda seleccionada
    const rates = await prisma.exchangeRate.findMany();
    const rateMap = { USD: 1 };
    rates.forEach((r) => {
      rateMap[r.currencyCode] = Number(r.rateToUsd);
    });

    // Validar stock y calcular total en USD
    let totalUsd = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(400).json({ error: `Producto con ID ${item.productId} no encontrado` });
      }
      if (!product.isActive) {
        return res.status(400).json({ error: `El producto "${product.name}" no está disponible` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${item.quantity}`,
        });
      }

      const priceUsd = Number(product.priceUsd);
      totalUsd += priceUsd * item.quantity;
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        priceUsdAtPurchase: priceUsd,
      });
    }

    // Calcular total en moneda seleccionada
    const rate = rateMap[selectedCurrency] || 1;
    const totalConverted = totalUsd * rate;

    // Crear la orden en una transacción (descontar stock + crear orden)
    const order = await prisma.$transaction(async (tx) => {
      // Descontar stock
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Crear orden
      const newOrder = await tx.order.create({
        data: {
          customerName,
          customerPhone,
          customerAddress: customerAddress || null,
          totalUsd,
          selectedCurrency: selectedCurrency || 'USD',
          totalInSelectedCurrency: totalConverted,
          paymentMethod,
          paymentStatus: 'pending',
          paymentProofDetails: proofDetails || {},
          items: {
            create: orderItemsData.map((oi) => ({
              productId: oi.productId,
              quantity: oi.quantity,
              priceUsdAtPurchase: oi.priceUsdAtPurchase,
            })),
          },
        },
        include: { items: true },
      });

      return newOrder;
    });

    console.log(`✅ Orden #${order.id} creada. Total: $${totalUsd} USD. Estado: pendiente`);

    res.status(201).json({
      success: true,
      orderId: order.id,
      message: 'Pedido registrado exitosamente. Está pendiente de verificación de pago.',
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Error interno al crear el pedido' });
  }
});

// ===========================================================================
// RUTAS ADMIN — Autenticación
// ===========================================================================

router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, username, expiresIn: '24h' });
});

router.get('/admin/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, username: req.adminUser.username });
});

// ===========================================================================
// RUTAS ADMIN — Tasas de cambio
// ===========================================================================

router.get('/admin/exchange-rates', authMiddleware, async (_req, res) => {
  try {
    const rates = await prisma.exchangeRate.findMany();
    res.json(rates);
  } catch (err) {
    console.error('Error fetching admin rates:', err);
    res.status(500).json({ error: 'Error al cargar tasas' });
  }
});

router.put('/admin/exchange-rates', authMiddleware, async (req, res) => {
  try {
    const { rates } = req.body;
    if (!Array.isArray(rates)) {
      return res.status(400).json({ error: 'Formato inválido. Esperado: { rates: [{ currencyCode, rateToUsd }] }' });
    }

    for (const rate of rates) {
      if (!rate.currencyCode || !rate.rateToUsd) continue;
      await prisma.exchangeRate.upsert({
        where: { currencyCode: rate.currencyCode },
        update: { rateToUsd: rate.rateToUsd },
        create: { currencyCode: rate.currencyCode, rateToUsd: rate.rateToUsd },
      });
    }

    const updated = await prisma.exchangeRate.findMany();
    res.json({ success: true, rates: updated });
  } catch (err) {
    console.error('Error updating rates:', err);
    res.status(500).json({ error: 'Error al actualizar tasas' });
  }
});

// ===========================================================================
// RUTAS ADMIN — Órdenes
// ===========================================================================

router.get('/admin/orders', authMiddleware, async (req, res) => {
  try {
    const { status, method, search, limit, offset } = req.query;
    const where = {};

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      where.paymentStatus = status;
    }
    if (method && ['pago_movil', 'zelle', 'cash_usd', 'cash_cop'].includes(method)) {
      where.paymentMethod = method;
    }
    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit ? Number(limit) : 50,
        skip: offset ? Number(offset) : 0,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({ orders, total });
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    res.status(500).json({ error: 'Error al cargar órdenes' });
  }
});

router.post('/admin/orders/:id/approve', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id: Number(id) } });

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    if (order.paymentStatus !== 'pending') {
      return res.status(400).json({ error: `La orden ya está en estado "${order.paymentStatus}"` });
    }

    const updated = await prisma.order.update({
      where: { id: Number(id) },
      data: { paymentStatus: 'approved' },
    });

    console.log(`✅ Orden #${id} APROBADA. Stock ya fue descontado al crear la orden.`);
    res.json({ success: true, order: updated });
  } catch (err) {
    console.error('Error approving order:', err);
    res.status(500).json({ error: 'Error al aprobar la orden' });
  }
});

router.post('/admin/orders/:id/reject', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    if (order.paymentStatus !== 'pending') {
      return res.status(400).json({ error: `La orden ya está en estado "${order.paymentStatus}"` });
    }

    // Al rechazar, devolvemos el stock
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      await tx.order.update({
        where: { id: Number(id) },
        data: { paymentStatus: 'rejected' },
      });
    });

    console.log(`❌ Orden #${id} RECHAZADA. Stock devuelto.`);
    res.json({ success: true, message: 'Orden rechazada y stock devuelto' });
  } catch (err) {
    console.error('Error rejecting order:', err);
    res.status(500).json({ error: 'Error al rechazar la orden' });
  }
});

// ===========================================================================
// RUTAS ADMIN — Resumen diario
// ===========================================================================

router.get('/admin/daily-summary', authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const endDate = new Date(targetDate);
    endDate.setDate(endDate.getDate() + 1);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: targetDate, lt: endDate },
        paymentStatus: 'approved',
      },
      orderBy: { createdAt: 'desc' },
    });

    // Desglose por método de pago
    const byMethod = {};
    const byCurrency = {};
    let totalUsd = 0;
    let totalVes = 0;
    let totalCop = 0;

    for (const order of orders) {
      const method = order.paymentMethod;
      if (!byMethod[method]) {
        byMethod[method] = { count: 0, totalUsd: 0 };
      }
      byMethod[method].count++;
      byMethod[method].totalUsd += Number(order.totalUsd);

      if (order.selectedCurrency === 'USD') totalUsd += Number(order.totalInSelectedCurrency);
      if (order.selectedCurrency === 'VES') totalVes += Number(order.totalInSelectedCurrency);
      if (order.selectedCurrency === 'COP') totalCop += Number(order.totalInSelectedCurrency);
    }

    byCurrency.USD = totalUsd;
    byCurrency.VES = totalVes;
    byCurrency.COP = totalCop;

    res.json({
      date: targetDate.toISOString().split('T')[0],
      totalOrders: orders.length,
      totalRevenueUsd: orders.reduce((sum, o) => sum + Number(o.totalUsd), 0),
      byMethod,
      byCurrency,
      orders,
    });
  } catch (err) {
    console.error('Error fetching daily summary:', err);
    res.status(500).json({ error: 'Error al cargar resumen diario' });
  }
});

// ===========================================================================
// RUTAS ADMIN — Configuración de pagos
// ===========================================================================

router.get('/admin/payment-config', authMiddleware, async (_req, res) => {
  try {
    const configs = await prisma.paymentConfig.findMany({ orderBy: { method: 'asc' } });
    res.json(configs);
  } catch (err) {
    console.error('Error fetching admin payment config:', err);
    res.status(500).json({ error: 'Error al cargar configuración de pagos' });
  }
});

router.put('/admin/payment-config/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { label, bankName, accountHolder, accountNumber, phone, instructions, isActive } = req.body;

    const updated = await prisma.paymentConfig.update({
      where: { id: Number(id) },
      data: {
        ...(label !== undefined && { label }),
        ...(bankName !== undefined && { bankName }),
        ...(accountHolder !== undefined && { accountHolder }),
        ...(accountNumber !== undefined && { accountNumber }),
        ...(phone !== undefined && { phone }),
        ...(instructions !== undefined && { instructions }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({ success: true, config: updated });
  } catch (err) {
    console.error('Error updating payment config:', err);
    res.status(500).json({ error: 'Error al actualizar configuración de pago' });
  }
});

// ===========================================================================
// RUTA PÚBLICA — Información del negocio
// ===========================================================================

router.get('/business-info', async (_req, res) => {
  try {
    let info = await prisma.businessInfo.findFirst();
    if (!info) {
      // Crear registro por defecto si no existe
      info = await prisma.businessInfo.create({
        data: {
          businessName: 'Veterinaria Mariangel',
          phone: '+584141234567',
          whatsappNumber: '584141234567',
          email: 'contacto@veterinariamariangel.com',
          address: 'Av. Principal de Las Mercedes, Caracas',
          schedule: {
            weekdays: { label: 'Lunes a Viernes', hours: '8:00 AM - 8:00 PM' },
            saturday: { label: 'Sábado', hours: '9:00 AM - 2:00 PM' },
            sunday: { label: 'Domingo', hours: 'Cerrado (solo urgencias)' },
            emergency: { label: 'Urgencias', hours: '24/7 · 365 días', highlight: true },
          },
          social: {
            facebook: '',
            instagram: '',
            twitter: '',
            tiktok: '',
          },
        },
      });
    }
    res.json(info);
  } catch (err) {
    console.error('Error fetching business info:', err);
    res.status(500).json({ error: 'Error al cargar información del negocio' });
  }
});

// ===========================================================================
// RUTAS ADMIN — Información del negocio
// ===========================================================================

router.get('/admin/business-info', authMiddleware, async (_req, res) => {
  try {
    let info = await prisma.businessInfo.findFirst();
    if (!info) {
      info = await prisma.businessInfo.create({
        data: {
          businessName: 'Veterinaria Mariangel',
          phone: '+584141234567',
          whatsappNumber: '584141234567',
          email: 'contacto@veterinariamariangel.com',
          schedule: {},
          social: {},
        },
      });
    }
    res.json(info);
  } catch (err) {
    console.error('Error fetching admin business info:', err);
    res.status(500).json({ error: 'Error al cargar información del negocio' });
  }
});

router.put('/admin/business-info', authMiddleware, async (req, res) => {
  try {
    const { businessName, tagline, phone, whatsappNumber, email, address, mapEmbedUrl, schedule, social } = req.body;

    let info = await prisma.businessInfo.findFirst();
    if (!info) {
      info = await prisma.businessInfo.create({
        data: {
          businessName: 'Veterinaria Mariangel',
          phone: '+584141234567',
          whatsappNumber: '584141234567',
          email: 'contacto@veterinariamariangel.com',
          schedule: {},
          social: {},
        },
      });
    }

    const updated = await prisma.businessInfo.update({
      where: { id: info.id },
      data: {
        ...(businessName !== undefined && { businessName }),
        ...(tagline !== undefined && { tagline }),
        ...(phone !== undefined && { phone }),
        ...(whatsappNumber !== undefined && { whatsappNumber }),
        ...(email !== undefined && { email }),
        ...(address !== undefined && { address }),
        ...(mapEmbedUrl !== undefined && { mapEmbedUrl }),
        ...(schedule !== undefined && { schedule }),
        ...(social !== undefined && { social }),
      },
    });

    console.log('✅ Información del negocio actualizada');
    res.json({ success: true, info: updated });
  } catch (err) {
    console.error('Error updating business info:', err);
    res.status(500).json({ error: 'Error al actualizar información del negocio' });
  }
});

// ===========================================================================
// RUTAS ADMIN — Productos (CRUD básico)
// ===========================================================================

router.get('/admin/products', authMiddleware, async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (err) {
    console.error('Error fetching admin products:', err);
    res.status(500).json({ error: 'Error al cargar productos' });
  }
});

router.put('/admin/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, priceUsd, stock, categoryId, imageUrl, isActive } = req.body;

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(priceUsd !== undefined && { priceUsd }),
        ...(stock !== undefined && { stock }),
        ...(categoryId !== undefined && { categoryId }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({ success: true, product: updated });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

router.post('/admin/products', authMiddleware, async (req, res) => {
  try {
    const { name, description, priceUsd, stock, categoryId, imageUrl } = req.body;
    if (!name || priceUsd === undefined || stock === undefined) {
      return res.status(400).json({ error: 'name, priceUsd y stock son obligatorios' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        priceUsd,
        stock,
        categoryId: categoryId || null,
        imageUrl: imageUrl || null,
        isActive: true,
      },
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});