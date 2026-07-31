import { Router } from 'express';

export const router = Router();

// ---------------------------------------------------------------------------
// Datos en memoria (seed). En producción se sustituiría por Prisma/DB.
// ---------------------------------------------------------------------------

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
    image: 'https://ui-avatars.com/api/?name=Mateo+Herrera&background=0D8ABC&color=fff&size=256',
  },
  {
    id: 3,
    name: 'Dra. Camila Torres',
    role: 'Médica de Animales Exóticos',
    specialty: 'Medicina de aves, reptiles y pequeños mamíferos',
    experience: '8 años',
    certifications: ['Exotic Animal Practice', 'Fear Free Certified'],
    bio: 'Referente regional en medicina de animales no convencionales y conservación.',
    image: 'https://ui-avatars.com/api/?name=Camila+Torres&background=E91E63&color=fff&size=256',
  },
  {
    id: 4,
    name: 'Dr. Sebastián Vega',
    role: 'Dermatología y Alergias',
    specialty: 'Dermatología veterinaria e inmunología',
    experience: '9 años',
    certifications: ['Dermatology Specialist', 'ISVD Member'],
    bio: 'Experto en diagnóstico y tratamiento de enfermedades de la piel y alergias crónicas.',
    image: 'https://ui-avatars.com/api/?name=Sebastian+Vega&background=4CAF50&color=fff&size=256',
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Laura Méndez',
    pet: 'Max · Labrador 4 años',
    rating: 5,
    text: 'Salvaron a Max de una torsión gástrica a medianoche. La atención de urgencia fue impecable y el seguimiento, extraordinario.',
    avatar: 'https://ui-avatars.com/api/?name=Laura+Mendez&background=FF9800&color=fff&size=256',
  },
  {
    id: 2,
    name: 'Carlos Pinto',
    pet: 'Michi · Gato Siamés 7 años',
    rating: 5,
    text: 'El enfoque Fear Free hizo que Michi no se estresara en su consulta. Por fin una veterinaria que entiende a los gatos.',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Pinto&background=2196F3&color=fff&size=256',
  },
  {
    id: 3,
    name: 'Andrea Salas',
    pet: 'Rocky · Bulldog 6 años',
    rating: 5,
    text: 'Reservé la cita online en 3 pasos y me atendieron puntual. El equipo médico es transparente y muy profesional.',
    avatar: 'https://ui-avatars.com/api/?name=Andrea+Salas&background=9C27B0&color=fff&size=256',
  },
  {
    id: 4,
    name: 'Jorge Núñez',
    pet: 'Luna · Coneja 2 años',
    rating: 5,
    text: 'Pocas veterinarias atienden conejos con tanta especialización. La Dra. Torres es una crack con animales exóticos.',
    avatar: 'https://ui-avatars.com/api/?name=Jorge+Nunez&background=009688&color=fff&size=256',
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
    image: '/blog/1.jpg',
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
    image: '/blog/2.jpg',
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
    image: '/blog/3.jpg',
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
    image: '/blog/4.jpg',
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

// Genera slots disponibles para los próximos 7 días
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

// Almacén en memoria de citas creadas
const appointments = [];

// ---------------------------------------------------------------------------
// Rutas
// ---------------------------------------------------------------------------

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