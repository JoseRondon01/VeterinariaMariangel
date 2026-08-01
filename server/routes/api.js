import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { prisma } from '../index.js';

export const router = Router();

// Multer config: guarda en memoria (pasamos a Cloudinary directamente)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Formato no permitido. Usa JPG, PNG, WEBP o GIF.'));
  },
});

// ===========================================================================
// Middleware de autenticacion JWT para rutas admin
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
    return res.status(401).json({ error: 'Token invalido o expirado' });
  }
}

// ===========================================================================
// Datos en memoria para endpoints veterinarios (seed)
// ===========================================================================

const services = [
  { id: 'consultas', title: 'Consultas Generales', description: 'Evaluacion clinica completa, diagnostico y plan de tratamiento personalizado para tu mascota.', icon: 'stethoscope', features: ['Examen fisico completo', 'Diagnostico por imagen', 'Seguimiento veterinario'], priceUsd: 25.00 },
  { id: 'cirugia', title: 'Cirugia y Traumatologia', description: 'Quirofano equipado con tecnologia de punta y monitoreo anestesico continuo para procedimientos seguros.', icon: 'scalpel', features: ['Cirugia general y blanda', 'Ortopedia', 'Monitoreo anestesico avanzado'], priceUsd: 150.00 },
  { id: 'peluqueria', title: 'Peluqueria y Estetica', description: 'Bano, corte y cuidado estetico con productos hipoalergenicos y personal certificado Fear Free.', icon: 'scissors', features: ['Bano medico', 'Corte de raza', 'Limpieza dental basica'], priceUsd: 20.00 },
  { id: 'laboratorio', title: 'Laboratorio Clinico', description: 'Analisis de sangre, orina y coprologicos con resultados el mismo dia para decisiones rapidas.', icon: 'flask', features: ['Hematologia completa', 'Bioquimica', 'Coprologia y citologia'], priceUsd: 35.00 },
  { id: 'exoticos', title: 'Animales Exoticos', description: 'Atencion especializada para conejos, aves, reptiles y mascotas no convencionales.', icon: 'paw', features: ['Medicina de aves', 'Reptiles y anfibios', 'Pequeños mamiferos'], priceUsd: 40.00 },
  { id: 'urgencias', title: 'Urgencias 24/7', description: 'Atencion inmediata las 24 horas, los 365 dias del año. Equipo de guardia siempre disponible.', icon: 'alert', features: ['Guardia permanente', 'UCI movil', 'Reanimacion y estabilizacion'], priceUsd: 75.00 },
];

const team = [
  { id: 1, name: 'Dra. Mariangel Garcia', role: 'Directora Medica - Medicina General', specialty: 'Medicina Preventiva y Medicina Interna', experience: '15 años', certifications: ['Fear Free Certified', 'AAHA Member', 'Especialista en Medicina Felina'], bio: 'Fundadora y directora de Veterinaria Mariangel. Con mas de 15 años de experiencia, ha dedicado su vida al cuidado integral de las mascotas, combinando la medicina preventiva con un trato cariñoso y personalizado.', image: '/dra-mariangel.png' },
  { id: 2, name: 'Dr. Mateo Herrera', role: 'Cirujano - Ortopedia', specialty: 'Cirugia de tejidos blandos y ortopedia', experience: '10 años', certifications: ['Cirugia Avanzada', 'AO Trauma Member'], bio: 'Especialista en procedimientos quirurgicos de alta complejidad con enfoque minimamente invasivo.', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 3, name: 'Dra. Camila Torres', role: 'Medica de Animales Exoticos', specialty: 'Medicina de aves, reptiles y pequeños mamiferos', experience: '8 años', certifications: ['Exotic Animal Practice', 'Fear Free Certified'], bio: 'Referente regional en medicina de animales no convencionales y conservacion.', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 4, name: 'Dr. Sebastian Vega', role: 'Dermatologia y Alergias', specialty: 'Dermatologia veterinaria e inmunologia', experience: '9 años', certifications: ['Dermatology Specialist', 'ISVD Member'], bio: 'Experto en diagnostico y tratamiento de enfermedades de la piel y alergias cronicas.', image: 'https://randomuser.me/api/portraits/men/75.jpg' },
];

const testimonials = [
  { id: 1, name: 'Laura Mendez', pet: 'Max - Labrador 4 años', rating: 5, text: 'Salvaron a Max de una torsion gastrica a medianoche. La atencion de urgencia fue impecable y el seguimiento, extraordinario.', avatar: 'https://randomuser.me/api/portraits/women/26.jpg' },
  { id: 2, name: 'Carlos Pinto', pet: 'Michi - Gato Siames 7 años', rating: 5, text: 'El enfoque Fear Free hizo que Michi no se estresara en su consulta. Por fin una veterinaria que entiende a los gatos.', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 3, name: 'Andrea Salas', pet: 'Rocky - Bulldog 6 años', rating: 5, text: 'Reserve la cita online en 3 pasos y me atendieron puntual. El equipo medico es transparente y muy profesional.', avatar: 'https://randomuser.me/api/portraits/women/52.jpg' },
  { id: 4, name: 'Jorge Nuñez', pet: 'Luna - Coneja 2 años', rating: 5, text: 'Pocas veterinarias atienden conejos con tanta especializacion. La Dra. Torres es una crack con animales exoticos.', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
];

const blog = [
  { id: 1, slug: 'vacunacion-cachorros-guia-completa', title: 'Vacunacion de cachorros: la guia completa 2026', excerpt: 'Todo lo que debes saber sobre el calendario de vacunas para proteger a tu cachorro durante su primer año de vida.', category: 'Salud Preventiva', date: '2026-07-15', readingTime: '6 min', image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=500&fit=crop', content: 'La vacunacion es el pilar de la medicina preventiva en cachorros. El calendario inicia entre las 6 y 8 semanas...' },
  { id: 2, slug: 'signos-emergencia-veterinaria', title: '7 signos de emergencia veterinaria que no debes ignorar', excerpt: 'Aprende a identificar señales criticas que requieren atencion veterinaria inmediata para salvar la vida de tu mascota.', category: 'Urgencias', date: '2026-07-10', readingTime: '5 min', image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=500&fit=crop', content: 'Reconocer una emergencia a tiempo puede marcar la diferencia. Dificultad respiratoria, vomito persistente...' },
  { id: 3, slug: 'cuidado-dental-felino', title: 'Cuidado dental en gatos: mas importante de lo que crees', excerpt: 'La enfermedad periodontal afecta al 70% de los gatos mayores de 3 años. Prevencion y tratamiento.', category: 'Salud Preventiva', date: '2026-07-05', readingTime: '4 min', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=500&fit=crop', content: 'La salud dental felina es frecuentemente subestimada. Una higiene adecuada previene dolor cronico...' },
  { id: 4, slug: 'alimentacion-perros-senior', title: 'Alimentacion para perros senior: claves de longevidad', excerpt: 'Como adaptar la dieta de tu perro mayor para mantener su calidad de vida y prevenir enfermedades cronicas.', category: 'Nutricion', date: '2026-06-28', readingTime: '7 min', image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&h=500&fit=crop', content: 'Los perros senior tienen necesidades nutricionales especificas. Proteinas de alta calidad, control calorico...' },
];

const species = [
  { id: 'perro', label: 'Perro', icon: '\uD83D\uDC15' },
  { id: 'gato', label: 'Gato', icon: '\uD83D\uDC08' },
  { id: 'conejo', label: 'Conejo', icon: '\uD83D\uDC07' },
  { id: 'ave', label: 'Ave', icon: '\uD83E\uDD9C' },
  { id: 'reptil', label: 'Reptil', icon: '\uD83E\uDD8E' },
  { id: 'otro', label: 'Otro', icon: '\uD83D\uDC3E' },
];

const visitReasons = ['Consulta general', 'Vacunacion', 'Urgencia', 'Cirugia', 'Peluqueria', 'Laboratorio', 'Control dental', 'Segunda opinion'];

function generateTimeSlots() {
  const slots = [];
  const now = new Date();
  for (let d = 1; d <= 7; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    const iso = date.toISOString().split('T')[0];
    const hours = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'];
    slots.push({ date: iso, label: date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }), hours });
  }
  return slots;
}

const appointments = [];

// ===========================================================================
// RUTAS PUBLICAS
// ===========================================================================

const adminServiceStore = services.map((s) => ({ ...s }));

router.get('/services', async (_req, res) => {
  try {
    const dbServices = await prisma.service.findMany({ where: { active: true }, orderBy: { id: 'asc' } });
    if (dbServices.length > 0) {
      const mapped = dbServices.map((s) => ({ id: s.slug, title: s.title, description: s.description, icon: s.icon, features: s.features || [], priceUsd: Number(s.priceUsd || 0) }));
      return res.json(mapped);
    }
    res.json(adminServiceStore);
  } catch (err) {
    console.error('Error fetching services from DB, fallback to memory:', err.message);
    res.json(adminServiceStore);
  }
});

router.get('/team', async (_req, res) => {
  try {
    const veterinarians = await prisma.veterinarian.findMany({ where: { active: true } });
    if (veterinarians.length > 0) {
      const mapped = veterinarians.map((v) => ({ id: v.id, name: v.fullName, role: v.role, specialty: v.specialty, experience: v.experience, certifications: v.certifications || [], bio: v.bio, image: v.image }));
      return res.json(mapped);
    }
    res.json(adminTeamStore);
  } catch (err) {
    console.error('Error fetching team from DB, fallback to memory:', err.message);
    res.json(adminTeamStore);
  }
});

const adminTestimonialStore = testimonials.map((t) => ({ ...t }));

router.get('/testimonials', async (_req, res) => {
  try {
    const dbTestimonials = await prisma.testimonial.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } });
    if (dbTestimonials.length > 0) return res.json(dbTestimonials);
    res.json(adminTestimonialStore);
  } catch (err) {
    console.error('Error fetching testimonials from DB, fallback to memory:', err.message);
    res.json(adminTestimonialStore);
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const { name, pet, rating, text, avatar } = req.body;
    if (!name || !text) return res.status(400).json({ error: 'Nombre y texto del testimonio son obligatorios' });
    const testimonialData = { name: name.trim(), pet: pet || '', rating: Math.min(5, Math.max(1, Number(rating) || 5)), text: text.trim(), avatar: avatar || '', active: true };
    try {
      const created = await prisma.testimonial.create({ data: testimonialData });
      console.log('Testimonio creado en DB:', created.name);
      return res.status(201).json({ success: true, testimonial: created });
    } catch (dbErr) {
      console.log('DB not ready, saving testimonial to memory:', dbErr.message);
      const newId = Math.max(0, ...adminTestimonialStore.map((t) => t.id)) + 1;
      const newTestimonial = { id: newId, ...testimonialData };
      adminTestimonialStore.push(newTestimonial);
      return res.status(201).json({ success: true, testimonial: newTestimonial });
    }
  } catch (err) {
    console.error('Error creating testimonial:', err);
    res.status(500).json({ error: 'Error al crear testimonio' });
  }
});

const adminBlogStore = blog.map((b) => ({ ...b }));

router.get('/blog', async (_req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
    if (posts.length > 0) {
      const mapped = posts.map((p) => ({ id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category, date: p.publishedAt ? new Date(p.publishedAt).toISOString().split('T')[0] : '', readingTime: p.readingTime || '5 min', image: p.coverImage, content: p.content, tags: p.tags || [] }));
      return res.json(mapped);
    }
    res.json(adminBlogStore);
  } catch (err) {
    console.error('Error fetching blog from DB, fallback to memory:', err.message);
    res.json(adminBlogStore);
  }
});

router.get('/blog/:slug', async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
    if (post) return res.json({ id: post.id, slug: post.slug, title: post.title, excerpt: post.excerpt, category: post.category, date: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : '', readingTime: post.readingTime || '5 min', image: post.coverImage, content: post.content, tags: post.tags || [] });
    const memPost = adminBlogStore.find((p) => p.slug === req.params.slug);
    if (!memPost) return res.status(404).json({ error: 'Articulo no encontrado' });
    res.json(memPost);
  } catch {
    const post = adminBlogStore.find((p) => p.slug === req.params.slug);
    if (!post) return res.status(404).json({ error: 'Articulo no encontrado' });
    res.json(post);
  }
});

router.get('/booking/species', (_req, res) => res.json(species));
router.get('/booking/reasons', (_req, res) => res.json(visitReasons));
router.get('/booking/slots', (_req, res) => res.json(generateTimeSlots()));

router.post('/appointments', (req, res) => {
  const { ownerName, phone, petName, speciesId, reason, date, time, notes } = req.body;
  if (!ownerName || !phone || !petName || !speciesId || !reason || !date || !time) {
    return res.status(400).json({ error: 'Faltan campos obligatorios', required: ['ownerName', 'phone', 'petName', 'speciesId', 'reason', 'date', 'time'] });
  }
  const appointment = { id: appointments.length + 1, ownerName, phone, petName, speciesId, reason, date, time, notes: notes || '', status: 'pendiente', createdAt: new Date().toISOString() };
  appointments.push(appointment);
  console.log('Nueva cita creada:', appointment);
  res.status(201).json({ success: true, message: 'Cita registrada con exito. Te contactaremos para confirmar.', appointment });
});

router.get('/appointments', (_req, res) => res.json(appointments));

// ===========================================================================
// RUTAS PUBLICAS - Marketplace
// ===========================================================================

router.get('/products', async (_req, res) => {
  try {
    const products = await prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.json([]);
  }
});

router.get('/categories', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.json([]);
  }
});

// Tasas de cambio - con fallback
router.get('/exchange-rates', async (_req, res) => {
  try {
    const rates = await prisma.exchangeRate.findMany();
    if (rates.length > 0) return res.json(rates);
  } catch (err) {
    console.error('Error fetching exchange rates from DB, fallback:', err.message);
  }
  res.json([
    { currencyCode: 'VES', rateToUsd: 0, updatedAt: new Date().toISOString() },
    { currencyCode: 'COP', rateToUsd: 0, updatedAt: new Date().toISOString() },
  ]);
});

router.get('/payment-config', async (_req, res) => {
  try {
    const configs = await prisma.paymentConfig.findMany({ where: { isActive: true } });
    res.json(configs);
  } catch (err) {
    console.error('Error fetching payment config:', err);
    res.json([]);
  }
});

// ===========================================================================
// RUTAS - Informacion del Negocio (Business Info)
// ===========================================================================

const BUSINESS_INFO_DEFAULTS = {
  businessName: 'Veterinaria Mariangel',
  tagline: 'Cuidamos a tu mascota como parte de la familia.',
  phone: '+584141234567',
  whatsappNumber: '584141234567',
  email: 'contacto@veterinariamariangel.com',
  address: 'Av. Rotaria, San Cristobal, Tachira',
  mapEmbedUrl: '',
  schedule: {
    weekdays: { label: 'Lunes a Viernes', hours: '8:00 AM - 8:00 PM' },
    saturday: { label: 'Sabado', hours: '9:00 AM - 2:00 PM' },
    sunday: { label: 'Domingo', hours: 'Cerrado (solo urgencias)' },
    emergency: { label: 'Urgencias', hours: '24/7 - 365 dias', highlight: true },
  },
  social: {
    facebook: 'https://www.facebook.com/jose.m.rondon.5',
    instagram: 'https://www.instagram.com/joserondoon01/',
    twitter: '',
    tiktok: '',
  },
};

router.get('/business-info', async (_req, res) => {
  try {
    const info = await prisma.businessInfo.findFirst({ orderBy: { id: 'asc' } });
    if (info) return res.json(info);
  } catch (err) {
    console.error('Error fetching business-info from DB:', err.message);
  }
  res.json(BUSINESS_INFO_DEFAULTS);
});

router.get('/admin/business-info', authMiddleware, async (_req, res) => {
  try {
    const info = await prisma.businessInfo.findFirst({ orderBy: { id: 'asc' } });
    if (info) return res.json(info);
  } catch (err) {
    console.error('Error fetching admin business-info from DB:', err.message);
  }
  res.json(BUSINESS_INFO_DEFAULTS);
});

router.put('/admin/business-info', authMiddleware, async (req, res) => {
  try {
    const { businessName, tagline, phone, whatsappNumber, email, address, mapEmbedUrl, schedule, social } = req.body;
    const data = {};
    if (businessName !== undefined) data.businessName = businessName;
    if (tagline !== undefined) data.tagline = tagline;
    if (phone !== undefined) data.phone = phone;
    if (whatsappNumber !== undefined) data.whatsappNumber = whatsappNumber;
    if (email !== undefined) data.email = email;
    if (address !== undefined) data.address = address;
    if (mapEmbedUrl !== undefined) data.mapEmbedUrl = mapEmbedUrl;
    if (schedule !== undefined) data.schedule = schedule;
    if (social !== undefined) data.social = social;

    const existing = await prisma.businessInfo.findFirst({ orderBy: { id: 'asc' } });
    let info;
    if (existing) {
      info = await prisma.businessInfo.update({ where: { id: existing.id }, data });
    } else {
      if (!data.businessName) data.businessName = 'Veterinaria Mariangel';
      if (!data.phone) data.phone = '+584141234567';
      if (!data.whatsappNumber) data.whatsappNumber = '584141234567';
      if (!data.email) data.email = 'contacto@veterinariamariangel.com';
      info = await prisma.businessInfo.create({ data });
    }
    console.log('Business info actualizada:', info.businessName);
    res.json({ success: true, info });
  } catch (err) {
    console.error('Error updating business-info, fallback:', err.message);
    res.json({
      success: true,
      info: {
        id: 1,
        businessName: req.body.businessName || 'Veterinaria Mariangel',
        tagline: req.body.tagline || '',
        phone: req.body.phone || '+584141234567',
        whatsappNumber: req.body.whatsappNumber || '584141234567',
        email: req.body.email || 'contacto@veterinariamariangel.com',
        address: req.body.address || 'Av. Rotaria, San Cristobal, Tachira',
        mapEmbedUrl: req.body.mapEmbedUrl || '',
        schedule: req.body.schedule || {},
        social: req.body.social || {},
      },
      warning: 'Guardado parcial. Posible error de DB: ' + err.message,
    });
  }
});

// ===========================================================================
// RUTA: Crear orden (pedido)
// ===========================================================================

router.post('/orders/create', async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, selectedCurrency, paymentMethod, items, proofDetails } = req.body;
    if (!customerName || !customerPhone || !paymentMethod || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: customerName, customerPhone, paymentMethod, items' });
    }
    const validMethods = ['pago_movil', 'zelle', 'cash_usd', 'cash_cop'];
    if (!validMethods.includes(paymentMethod)) return res.status(400).json({ error: 'Metodo de pago invalido' });

    const rates = await prisma.exchangeRate.findMany();
    const rateMap = { USD: 1 };
    rates.forEach((r) => { rateMap[r.currencyCode] = Number(r.rateToUsd); });

    let totalUsd = 0;
    const orderItemsData = [];
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) return res.status(400).json({ error: 'Producto con ID ' + item.productId + ' no encontrado' });
      if (!product.isActive) return res.status(400).json({ error: 'El producto "' + product.name + '" no esta disponible' });
      if (product.stock < item.quantity) return res.status(400).json({ error: 'Stock insuficiente para "' + product.name + '". Disponible: ' + product.stock + ', solicitado: ' + item.quantity });
      const priceUsd = Number(product.priceUsd);
      totalUsd += priceUsd * item.quantity;
      orderItemsData.push({ productId: item.productId, quantity: item.quantity, priceUsdAtPurchase: priceUsd });
    }

    const rate = rateMap[selectedCurrency] || 1;
    const totalConverted = totalUsd * rate;

    const order = await prisma.$transaction(async (tx) => {
      for (const item of orderItemsData) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
      }
      return await tx.order.create({
        data: {
          customerName, customerPhone, customerAddress: customerAddress || null, totalUsd,
          selectedCurrency: selectedCurrency || 'USD', totalInSelectedCurrency: totalConverted,
          paymentMethod, paymentStatus: 'pending', paymentProofDetails: proofDetails || {},
          items: { create: orderItemsData.map((oi) => ({ productId: oi.productId, quantity: oi.quantity, priceUsdAtPurchase: oi.priceUsdAtPurchase })) },
        },
        include: { items: true },
      });
    });

    console.log('Orden #' + order.id + ' creada. Total: $' + totalUsd + ' USD. Estado: pendiente');
    res.status(201).json({ success: true, orderId: order.id, message: 'Pedido registrado exitosamente. Esta pendiente de verificacion de pago.' });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Error interno al crear el pedido' });
  }
});

// ===========================================================================
// RUTAS ADMIN - Autenticacion
// ===========================================================================

router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  if (username !== ADMIN_USER || password !== ADMIN_PASS) return res.status(401).json({ error: 'Credenciales invalidas' });
  const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, username, expiresIn: '24h' });
});

router.get('/admin/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, username: req.adminUser.username });
});

// ===========================================================================
// RUTAS ADMIN - Tasas de cambio (con fallback)
// ===========================================================================

router.get('/admin/exchange-rates', authMiddleware, async (_req, res) => {
  try {
    const rates = await prisma.exchangeRate.findMany();
    if (rates.length > 0) return res.json(rates);
  } catch (err) {
    console.error('Error fetching admin rates from DB, fallback:', err.message);
  }
  res.json([
    { currencyCode: 'VES', rateToUsd: 0, updatedAt: new Date().toISOString() },
    { currencyCode: 'COP', rateToUsd: 0, updatedAt: new Date().toISOString() },
  ]);
});

router.put('/admin/exchange-rates', authMiddleware, async (req, res) => {
  try {
    const { rates } = req.body;
    if (!Array.isArray(rates)) return res.status(400).json({ error: 'Formato invalido. Esperado: { rates: [{ currencyCode, rateToUsd }] }' });
    for (const rate of rates) {
      if (!rate.currencyCode || !rate.rateToUsd) continue;
      await prisma.exchangeRate.upsert({ where: { currencyCode: rate.currencyCode }, update: { rateToUsd: rate.rateToUsd }, create: { currencyCode: rate.currencyCode, rateToUsd: rate.rateToUsd } });
    }
    const updated = await prisma.exchangeRate.findMany();
    res.json({ success: true, rates: updated });
  } catch (err) {
    console.error('Error updating rates:', err);
    res.status(500).json({ error: 'Error al actualizar tasas' });
  }
});

// ===========================================================================
// RUTAS ADMIN - Ordenes (con fallback)
// ===========================================================================

router.get('/admin/orders', authMiddleware, async (req, res) => {
  try {
    const { status, method, search, limit, offset } = req.query;
    const where = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) where.paymentStatus = status;
    if (method && ['pago_movil', 'zelle', 'cash_usd', 'cash_cop'].includes(method)) where.paymentMethod = method;
    if (search) where.OR = [{ customerName: { contains: search } }, { customerPhone: { contains: search } }];

    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where, include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' }, take: limit ? Number(limit) : 50, skip: offset ? Number(offset) : 0 }),
      prisma.order.count({ where }),
    ]);
    res.json({ orders, total });
  } catch (err) {
    console.error('Error fetching admin orders, fallback:', err.message);
    res.json({ orders: [], total: 0 });
  }
});

router.post('/admin/orders/:id/approve', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id: Number(id) } });
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    if (order.paymentStatus !== 'pending') return res.status(400).json({ error: 'La orden ya esta en estado "' + order.paymentStatus + '"' });
    const updated = await prisma.order.update({ where: { id: Number(id) }, data: { paymentStatus: 'approved' } });
    console.log('Orden #' + id + ' APROBADA. Stock ya fue descontado al crear la orden.');
    res.json({ success: true, order: updated });
  } catch (err) {
    console.error('Error approving order:', err);
    res.status(500).json({ error: 'Error al aprobar la orden' });
  }
});

router.post('/admin/orders/:id/reject', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id: Number(id) }, include: { items: true } });
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    if (order.paymentStatus !== 'pending') return res.status(400).json({ error: 'La orden ya esta en estado "' + order.paymentStatus + '"' });
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
      }
      await tx.order.update({ where: { id: Number(id) }, data: { paymentStatus: 'rejected' } });
    });
    console.log('Orden #' + id + ' RECHAZADA. Stock devuelto.');
    res.json({ success: true, message: 'Orden rechazada y stock devuelto' });
  } catch (err) {
    console.error('Error rejecting order:', err);
    res.status(500).json({ error: 'Error al rechazar la orden' });
  }
});

// ===========================================================================
// RUTAS ADMIN - Resumen diario
// ===========================================================================

router.get('/admin/daily-summary', authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const endDate = new Date(targetDate);
    endDate.setDate(endDate.getDate() + 1);
    const orders = await prisma.order.findMany({ where: { createdAt: { gte: targetDate, lt: endDate }, paymentStatus: 'approved' }, orderBy: { createdAt: 'desc' } });
    const byMethod = {}, byCurrency = {};
    let totalUsd = 0, totalVes = 0, totalCop = 0;
    for (const order of orders) {
      const method = order.paymentMethod;
      if (!byMethod[method]) byMethod[method] = { count: 0, totalUsd: 0 };
      byMethod[method].count++;
      byMethod[method].totalUsd += Number(order.totalUsd);
      if (order.selectedCurrency === 'USD') totalUsd += Number(order.totalInSelectedCurrency);
      if (order.selectedCurrency === 'VES') totalVes += Number(order.totalInSelectedCurrency);
      if (order.selectedCurrency === 'COP') totalCop += Number(order.totalInSelectedCurrency);
    }
    byCurrency.USD = totalUsd; byCurrency.VES = totalVes; byCurrency.COP = totalCop;
    res.json({ date: targetDate.toISOString().split('T')[0], totalOrders: orders.length, totalRevenueUsd: orders.reduce((sum, o) => sum + Number(o.totalUsd), 0), byMethod, byCurrency, orders });
  } catch (err) {
    console.error('Error fetching daily summary:', err);
    res.json({ date: '', totalOrders: 0, totalRevenueUsd: 0, byMethod: {}, byCurrency: {}, orders: [] });
  }
});

// ===========================================================================
// RUTAS ADMIN - Configuracion de pagos
// ===========================================================================

router.get('/admin/payment-config', authMiddleware, async (_req, res) => {
  try {
    const configs = await prisma.paymentConfig.findMany({ orderBy: { method: 'asc' } });
    res.json(configs);
  } catch (err) {
    console.error('Error fetching admin payment config:', err);
    res.json([]);
  }
});

router.put('/admin/payment-config/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { label, bankName, accountHolder, accountNumber, phone, instructions, isActive } = req.body;
    const updated = await prisma.paymentConfig.update({
      where: { id: Number(id) },
      data: { ...(label !== undefined && { label }), ...(bankName !== undefined && { bankName }), ...(accountHolder !== undefined && { accountHolder }), ...(accountNumber !== undefined && { accountNumber }), ...(phone !== undefined && { phone }), ...(instructions !== undefined && { instructions }), ...(isActive !== undefined && { isActive }) },
    });
    res.json({ success: true, config: updated });
  } catch (err) {
    console.error('Error updating payment config:', err);
    res.status(500).json({ error: 'Error al actualizar configuracion de pago' });
  }
});

// ===========================================================================
// RUTAS ADMIN - Hero (Portada / Inicio)
// ===========================================================================

const HERO_DEFAULTS = {
  badgeText: 'Urgencias disponibles 24/7',
  titleLine1: 'Cuidamos a tu mascota',
  titleHighlight: 'como parte de la familia',
  subtitle: 'Clinica veterinaria con equipo medico certificado, tecnologia de punta y trato humano. Agenda tu cita online en solo 3 pasos.',
  ctaPrimary: 'Agendar Cita',
  ctaSecondary: 'Emergencia 24/7',
  metrics: [{ value: '5,000+', label: 'mascotas atendidas' }, { value: '4.9\u2605', label: '487 resenas' }, { value: '12+', label: 'anos de experiencia' }],
  heroImage: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=800&fit=crop',
  certificationIcon: '\uD83C\uDFC6',
  certificationTitle: 'Fear Free Certified',
  certificationSubtitle: 'Atencion sin estres',
};

router.get('/admin/hero', authMiddleware, async (_req, res) => {
  try {
    let info = await prisma.businessInfo.findFirst();
    if (!info || !info.hero) return res.json(HERO_DEFAULTS);
    res.json(info.hero);
  } catch (err) {
    console.error('Error fetching hero:', err.message);
    res.json(HERO_DEFAULTS);
  }
});

router.put('/admin/hero', authMiddleware, async (req, res) => {
  try {
    const heroData = req.body;
    let info = await prisma.businessInfo.findFirst();
    if (!info) info = await prisma.businessInfo.create({ data: {} });
    await prisma.businessInfo.update({ where: { id: info.id }, data: { hero: heroData } });
    console.log('Hero actualizado');
    res.json({ success: true, hero: heroData });
  } catch (err) {
    console.error('Error updating hero:', err.message);
    res.json({ success: true, hero: req.body, warning: 'Guardado en memoria. Ejecuta la migracion de BD para persistir.' });
  }
});

router.get('/hero', async (_req, res) => {
  try {
    let info = await prisma.businessInfo.findFirst();
    if (!info || !info.hero) return res.json(HERO_DEFAULTS);
    res.json(info.hero);
  } catch (err) {
    console.error('Error fetching hero (public):', err.message);
    res.json(HERO_DEFAULTS);
  }
});

// ===========================================================================
// RUTAS ADMIN - Productos
// ===========================================================================

router.get('/admin/products', authMiddleware, async (_req, res) => {
  try {
    const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } });
    res.json(products);
  } catch (err) {
    console.error('Error fetching admin products:', err);
    res.json([]);
  }
});

router.put('/admin/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, priceUsd, stock, categoryId, imageUrl, isActive } = req.body;
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: { ...(name !== undefined && { name }), ...(description !== undefined && { description }), ...(priceUsd !== undefined && { priceUsd }), ...(stock !== undefined && { stock }), ...(categoryId !== undefined && { categoryId }), ...(imageUrl !== undefined && { imageUrl }), ...(isActive !== undefined && { isActive }) },
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
    if (!name || priceUsd === undefined || stock === undefined) return res.status(400).json({ error: 'name, priceUsd y stock son obligatorios' });
    const product = await prisma.product.create({ data: { name, description: description || '', priceUsd, stock, categoryId: categoryId || null, imageUrl: imageUrl || null, isActive: true } });
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

router.delete('/admin/products/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// ===========================================================================
// RUTAS ADMIN - Equipo
// ===========================================================================

const adminTeamStore = team.map((v) => ({ ...v }));

router.get('/admin/team', authMiddleware, async (_req, res) => {
  try {
    const veterinarians = await prisma.veterinarian.findMany({ orderBy: { id: 'asc' } });
    if (veterinarians.length > 0) return res.json(veterinarians);
    res.json(adminTeamStore);
  } catch (err) {
    console.error('Error fetching admin team, fallback to memory:', err.message);
    res.json(adminTeamStore);
  }
});

router.put('/admin/team/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, role, specialty, experience, bio, certifications, image, active } = req.body;
    try {
      const updated = await prisma.veterinarian.update({
        where: { id: Number(id) },
        data: { ...(fullName !== undefined && { fullName }), ...(role !== undefined && { role }), ...(specialty !== undefined && { specialty }), ...(experience !== undefined && { experience }), ...(bio !== undefined && { bio }), ...(certifications !== undefined && { certifications }), ...(image !== undefined && { image }), ...(active !== undefined && { active }) },
      });
      console.log('Veterinario #' + id + ' actualizado en DB:', updated.fullName);
      return res.json({ success: true, veterinarian: updated });
    } catch (dbErr) {
      console.log('DB not ready, saving to memory store:', dbErr.message);
      const member = adminTeamStore.find((v) => v.id === Number(id));
      if (!member) return res.status(404).json({ error: 'Veterinario no encontrado' });
      if (fullName !== undefined) member.name = fullName;
      if (role !== undefined) member.role = role;
      if (specialty !== undefined) member.specialty = specialty;
      if (experience !== undefined) member.experience = experience;
      if (bio !== undefined) member.bio = bio;
      if (certifications !== undefined) member.certifications = certifications;
      if (image !== undefined) member.image = image;
      return res.json({ success: true, veterinarian: { id: Number(id), fullName: member.name, role: member.role, specialty: member.specialty, experience: member.experience, bio: member.bio, certifications: member.certifications || [], image: member.image, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } });
    }
  } catch (err) {
    console.error('Error updating veterinarian:', err);
    res.status(500).json({ error: 'Error al actualizar veterinario' });
  }
});

// ===========================================================================
// RUTAS ADMIN - Blog
// ===========================================================================

router.get('/admin/blog', authMiddleware, async (_req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    if (posts.length > 0) return res.json(posts);
    res.json(adminBlogStore);
  } catch (err) {
    console.error('Error fetching admin blog, fallback to memory:', err.message);
    res.json(adminBlogStore);
  }
});

router.put('/admin/blog/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, category, date, readingTime, content, image, slug, published } = req.body;
    try {
      const data = {};
      if (title !== undefined) data.title = title;
      if (excerpt !== undefined) data.excerpt = excerpt;
      if (category !== undefined) data.category = category;
      if (readingTime !== undefined) data.readingTime = readingTime;
      if (content !== undefined) data.content = content;
      if (image !== undefined) data.coverImage = image;
      if (published !== undefined) data.published = published;
      if (slug !== undefined) data.slug = slug;
      if (date !== undefined) data.publishedAt = new Date(date);
      const updated = await prisma.blogPost.update({ where: { id: Number(id) }, data });
      console.log('Blog #' + id + ' actualizado en DB:', updated.title);
      return res.json({ success: true, post: updated });
    } catch (dbErr) {
      console.log('DB not ready, saving blog to memory:', dbErr.message);
      const member = adminBlogStore.find((b) => b.id === Number(id));
      if (!member) return res.status(404).json({ error: 'Articulo no encontrado' });
      if (title !== undefined) member.title = title;
      if (excerpt !== undefined) member.excerpt = excerpt;
      if (category !== undefined) member.category = category;
      if (date !== undefined) member.date = date;
      if (readingTime !== undefined) member.readingTime = readingTime;
      if (content !== undefined) member.content = content;
      if (image !== undefined) member.image = image;
      if (slug !== undefined) member.slug = slug;
      return res.json({ success: true, post: member });
    }
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ error: 'Error al actualizar articulo' });
  }
});

router.post('/admin/blog', authMiddleware, async (req, res) => {
  try {
    const { title, excerpt, category, date, readingTime, content, image, slug } = req.body;
    if (!title) return res.status(400).json({ error: 'El titulo es obligatorio' });
    const newSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 100);
    try {
      const post = await prisma.blogPost.create({ data: { title, slug: newSlug, excerpt: excerpt || '', category: category || 'Salud Preventiva', readingTime: readingTime || '5 min', content: content || '', coverImage: image || null, published: true, publishedAt: date ? new Date(date) : new Date() } });
      return res.status(201).json({ success: true, post });
    } catch (dbErr) {
      console.log('DB not ready, creating blog in memory:', dbErr.message);
      const newId = Math.max(0, ...adminBlogStore.map((b) => b.id)) + 1;
      const newPost = { id: newId, slug: newSlug, title, excerpt: excerpt || '', category: category || 'Salud Preventiva', date: date || new Date().toISOString().split('T')[0], readingTime: readingTime || '5 min', image: image || null, content: content || '' };
      adminBlogStore.push(newPost);
      return res.status(201).json({ success: true, post: newPost });
    }
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ error: 'Error al crear articulo' });
  }
});

router.delete('/admin/blog/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await prisma.blogPost.delete({ where: { id: Number(id) } });
      return res.json({ success: true });
    } catch (dbErr) {
      const idx = adminBlogStore.findIndex((b) => b.id === Number(id));
      if (idx === -1) return res.status(404).json({ error: 'Articulo no encontrado' });
      adminBlogStore.splice(idx, 1);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ error: 'Error al eliminar articulo' });
  }
});

// ===========================================================================
// RUTAS ADMIN - Testimonios
// ===========================================================================

router.get('/admin/testimonials', authMiddleware, async (_req, res) => {
  try {
    const dbTestimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    if (dbTestimonials.length > 0) return res.json(dbTestimonials);
    res.json(adminTestimonialStore);
  } catch (err) {
    console.error('Error fetching admin testimonials, fallback to memory:', err.message);
    res.json(adminTestimonialStore);
  }
});

router.put('/admin/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, pet, rating, text, avatar, active } = req.body;
    try {
      const data = {};
      if (name !== undefined) data.name = name;
      if (pet !== undefined) data.pet = pet;
      if (rating !== undefined) data.rating = rating;
      if (text !== undefined) data.text = text;
      if (avatar !== undefined) data.avatar = avatar;
      if (active !== undefined) data.active = active;
      const updated = await prisma.testimonial.update({ where: { id: Number(id) }, data });
      return res.json({ success: true, testimonial: updated });
    } catch (dbErr) {
      const member = adminTestimonialStore.find((t) => t.id === Number(id));
      if (!member) return res.status(404).json({ error: 'Testimonio no encontrado' });
      if (name !== undefined) member.name = name;
      if (pet !== undefined) member.pet = pet;
      if (rating !== undefined) member.rating = rating;
      if (text !== undefined) member.text = text;
      if (avatar !== undefined) member.avatar = avatar;
      return res.json({ success: true, testimonial: member });
    }
  } catch (err) {
    console.error('Error updating testimonial:', err);
    res.status(500).json({ error: 'Error al actualizar testimonio' });
  }
});

router.delete('/admin/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await prisma.testimonial.delete({ where: { id: Number(id) } });
      return res.json({ success: true });
    } catch (dbErr) {
      const idx = adminTestimonialStore.findIndex((t) => t.id === Number(id));
      if (idx === -1) return res.status(404).json({ error: 'Testimonio no encontrado' });
      adminTestimonialStore.splice(idx, 1);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json({ error: 'Error al eliminar testimonio' });
  }
});

// ===========================================================================
// RUTAS ADMIN - Servicios
// ===========================================================================

router.get('/admin/services', authMiddleware, async (_req, res) => {
  try {
    const dbServices = await prisma.service.findMany({ orderBy: { id: 'asc' } });
    if (dbServices.length > 0) {
      const mapped = dbServices.map((s) => ({ id: s.slug, title: s.title, description: s.description, icon: s.icon, features: s.features || [], priceUsd: Number(s.priceUsd || 0) }));
      return res.json(mapped);
    }
    res.json(adminServiceStore);
  } catch (err) {
    console.error('Error fetching admin services, fallback to memory:', err.message);
    res.json(adminServiceStore);
  }
});

router.put('/admin/services/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon, features, priceUsd } = req.body;
    try {
      const data = { ...(title !== undefined && { title }), ...(description !== undefined && { description }), ...(icon !== undefined && { icon }), ...(features !== undefined && { features }), ...(priceUsd !== undefined && { priceUsd }) };
      const updated = await prisma.service.update({ where: { slug: id }, data });
      return res.json({ success: true, service: { id: updated.slug, title: updated.title, description: updated.description, icon: updated.icon, features: updated.features, priceUsd: Number(updated.priceUsd || 0) } });
    } catch (dbErr) {
      const member = adminServiceStore.find((s) => s.id === id);
      if (!member) return res.status(404).json({ error: 'Servicio no encontrado' });
      if (title !== undefined) member.title = title;
      if (description !== undefined) member.description = description;
      if (icon !== undefined) member.icon = icon;
      if (features !== undefined) member.features = features;
      if (priceUsd !== undefined) member.priceUsd = priceUsd;
      return res.json({ success: true, service: member });
    }
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
});

router.post('/admin/services', authMiddleware, async (req, res) => {
  try {
    const { id, title, description, icon, features, priceUsd } = req.body;
    if (!id || !title) return res.status(400).json({ error: 'id y title son obligatorios' });
    try {
      const created = await prisma.service.create({ data: { slug: id, title, description: description || '', icon: icon || '', features: features || [], priceUsd: Number(priceUsd || 0) } });
      return res.status(201).json({ success: true, service: { id: created.slug, title: created.title, description: created.description, icon: created.icon, features: created.features, priceUsd: Number(created.priceUsd || 0) } });
    } catch (dbErr) {
      adminServiceStore.push({ id, title, description: description || '', icon: icon || '', features: features || [], priceUsd: Number(priceUsd || 0) });
      return res.status(201).json({ success: true, service: { id, title, description: description || '', icon: icon || '', features: features || [], priceUsd: Number(priceUsd || 0) } });
    }
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
});

router.delete('/admin/services/:id', authMiddleware, async (req, res) => {
  try {
    try {
      await prisma.service.update({ where: { slug: req.params.id }, data: { active: false } });
      return res.json({ success: true });
    } catch (dbErr) {
      const idx = adminServiceStore.findIndex((s) => s.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Servicio no encontrado' });
      adminServiceStore.splice(idx, 1);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
});

// Upload image to Cloudinary
router.post("/admin/upload", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No se recibio ninguna imagen" });
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "veterinaria-mariangel/products", resource_type: "image", transformation: [{ quality: "auto", fetch_format: "auto" }] },
        (error, result) => { if (error) reject(error); else resolve(result); }
      );
      stream.end(req.file.buffer);
    });
    res.json({ success: true, url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error al subir imagen" });
  }
});