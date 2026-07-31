import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Categorías
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'alimentos' }, update: {}, create: { name: 'Alimentos', slug: 'alimentos' } }),
    prisma.category.upsert({ where: { slug: 'medicamentos' }, update: {}, create: { name: 'Medicamentos', slug: 'medicamentos' } }),
    prisma.category.upsert({ where: { slug: 'accesorios' }, update: {}, create: { name: 'Accesorios', slug: 'accesorios' } }),
    prisma.category.upsert({ where: { slug: 'higiene-y-cuidado' }, update: {}, create: { name: 'Higiene y Cuidado', slug: 'higiene-y-cuidado' } }),
    prisma.category.upsert({ where: { slug: 'juguetes' }, update: {}, create: { name: 'Juguetes', slug: 'juguetes' } }),
  ]);
  console.log(`  ✅ ${categories.length} categorías`);

  // Productos
  const products = [
    { name: 'Purina Pro Plan Adulto 15kg', description: 'Alimento balanceado para perros adultos de todas las razas. Fórmula con proteína de pollo como primer ingrediente.', priceUsd: 45.00, stock: 20, categoryId: categories[0].id, imageUrl: '/products/purina-pro-plan.png' },
    { name: 'Royal Canin Mini Adult 7.5kg', description: 'Alimento para perros adultos de raza pequeña (hasta 10kg). Croquetas adaptadas al tamaño de su mandíbula.', priceUsd: 38.50, stock: 15, categoryId: categories[0].id, imageUrl: '/products/royal-canin-mini.png' },
    { name: 'Bravecto Comprimido 20-40kg', description: 'Antiparasitario oral de larga duración. Protege contra pulgas y garrapatas por 12 semanas.', priceUsd: 32.00, stock: 30, categoryId: categories[1].id, imageUrl: '/products/bravecto.png' },
    { name: 'Simparica Trio 10-20kg', description: 'Triple protección: pulgas, garrapatas y parásitos intestinales en un solo comprimido mensual.', priceUsd: 28.00, stock: 25, categoryId: categories[1].id, imageUrl: '/products/simparica-trio.png' },
    { name: 'Collar Seresto Antipulgas Gato', description: 'Collar repelente de pulgas y garrapatas para gatos. Protección por 8 meses.', priceUsd: 18.00, stock: 12, categoryId: categories[2].id, imageUrl: '/products/seresto-gato.png' },
    { name: 'Arnés Pechera Acolchado M', description: 'Arnés ergonómico acolchado para perros medianos. Cierre de seguridad, reflectante.', priceUsd: 12.50, stock: 18, categoryId: categories[2].id, imageUrl: '/products/arnes-acolchado.png' },
    { name: 'Shampoo Dermatológico Veterinario', description: 'Shampoo medicado para perros con piel sensible o problemas dermatológicos. pH balanceado.', priceUsd: 15.00, stock: 22, categoryId: categories[3].id, imageUrl: '/products/shampoo-dermatologico.png' },
    { name: 'Cepillo Dental + Pasta Enzimática', description: 'Kit de higiene dental para perros. Pasta enzimática sabor pollo + cepillo de doble cabeza.', priceUsd: 9.50, stock: 35, categoryId: categories[3].id, imageUrl: '/products/kit-dental.png' },
    { name: 'Kong Classic Grande', description: 'Juguete interactivo de caucho natural. Ideal para masticadores fuertes. Se puede rellenar.', priceUsd: 14.00, stock: 10, categoryId: categories[4].id, imageUrl: '/products/kong-classic.png' },
    { name: 'Pelota Lanzador con Sonido', description: 'Pelota resistente con sonido interno. Ideal para juegos de búsqueda y ejercicio.', priceUsd: 6.50, stock: 40, categoryId: categories[4].id, imageUrl: '/products/pelota-sonido.png' },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }
  console.log(`  ✅ ${products.length} productos`);

  // Tasas de cambio
  await prisma.exchangeRate.upsert({ where: { currencyCode: 'VES' }, update: { rateToUsd: 35.50 }, create: { currencyCode: 'VES', rateToUsd: 35.50 } });
  await prisma.exchangeRate.upsert({ where: { currencyCode: 'COP' }, update: { rateToUsd: 4200.00 }, create: { currencyCode: 'COP', rateToUsd: 4200.00 } });
  console.log('  ✅ Tasas de cambio (VES=35.50, COP=4200.00)');

  // Config de pagos
  const paymentConfigs = [
    { method: 'pago_movil', label: 'Pago Móvil', bankName: 'Banco de Venezuela', accountHolder: 'Veterinaria Mariangel C.A.', accountNumber: '01020415550000333444', phone: '+584141234567', instructions: 'Transfiere el monto exacto y reporta los últimos 4 dígitos de la referencia.', isActive: true },
    { method: 'zelle', label: 'Zelle', bankName: null, accountHolder: 'Mariangel Garcia', accountNumber: 'mariangel.vet@gmail.com', phone: null, instructions: 'Envía el monto exacto en USD y reporta el número de confirmación de Zelle.', isActive: true },
    { method: 'cash_usd', label: 'Efectivo USD', bankName: null, accountHolder: null, accountNumber: null, phone: null, instructions: 'Pago contra entrega o retiro en tienda. Solo billetes en buen estado.', isActive: true },
    { method: 'cash_cop', label: 'Efectivo COP', bankName: null, accountHolder: null, accountNumber: null, phone: null, instructions: 'Pago contra entrega o retiro en tienda. Solo billetes colombianos en buen estado.', isActive: true },
  ];

  for (const pc of paymentConfigs) {
    await prisma.paymentConfig.upsert({ where: { method: pc.method }, update: pc, create: pc });
  }
  console.log(`  ✅ ${paymentConfigs.length} configuraciones de pago`);

  // Veterinarios (Equipo)
  const veterinarians = [
    {
      firstName: 'Mariangel', lastName: 'Garcia', fullName: 'Dra. Mariangel Garcia',
      role: 'Directora Médica · Medicina General', specialty: 'Medicina Preventiva y Medicina Interna',
      experience: '15 años', bio: 'Fundadora y directora de Veterinaria Mariangel. Con más de 15 años de experiencia, ha dedicado su vida al cuidado integral de las mascotas, combinando la medicina preventiva con un trato cariñoso y personalizado.',
      image: '/dra-mariangel.png',
      certifications: ['Fear Free Certified', 'AAHA Member', 'Especialista en Medicina Felina'],
      active: true,
    },
    {
      firstName: 'Mateo', lastName: 'Herrera', fullName: 'Dr. Mateo Herrera',
      role: 'Cirujano · Ortopedia', specialty: 'Cirugía de tejidos blandos y ortopedia',
      experience: '10 años', bio: 'Especialista en procedimientos quirúrgicos de alta complejidad con enfoque mínimamente invasivo.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      certifications: ['Cirugía Avanzada', 'AO Trauma Member'],
      active: true,
    },
    {
      firstName: 'Camila', lastName: 'Torres', fullName: 'Dra. Camila Torres',
      role: 'Médica de Animales Exóticos', specialty: 'Medicina de aves, reptiles y pequeños mamíferos',
      experience: '8 años', bio: 'Referente regional en medicina de animales no convencionales y conservación.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      certifications: ['Exotic Animal Practice', 'Fear Free Certified'],
      active: true,
    },
    {
      firstName: 'Sebastián', lastName: 'Vega', fullName: 'Dr. Sebastián Vega',
      role: 'Dermatología y Alergias', specialty: 'Dermatología veterinaria e inmunología',
      experience: '9 años', bio: 'Experto en diagnóstico y tratamiento de enfermedades de la piel y alergias crónicas.',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      certifications: ['Dermatology Specialist', 'ISVD Member'],
      active: true,
    },
  ];

  for (const v of veterinarians) {
    await prisma.veterinarian.create({ data: v });
  }
  console.log(`  ✅ ${veterinarians.length} veterinarios`);

  console.log('\n🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());