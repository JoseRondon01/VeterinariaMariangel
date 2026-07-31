import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.businessInfo.deleteMany();

  await prisma.businessInfo.create({
    data: {
      businessName: 'Veterinaria Mariangel',
      tagline: 'Clínica veterinaria comprometida con el bienestar de tu mascota. Atención humana, tecnología de punta y equipo certificado.',
      phone: '+584141234567',
      whatsappNumber: '584141234567',
      email: 'contacto@veterinariamariangel.com',
      address: 'Av. Principal de Las Mercedes, Edif. VetCare, Local 1, Caracas',
      mapEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=-66.8756%2C10.4798%2C-66.8556%2C10.4898&layer=mapnik&marker=10.4848%2C-66.8656',
      schedule: {
        weekdays: { label: 'Lunes a Viernes', hours: '8:00 AM - 8:00 PM' },
        saturday: { label: 'Sábado', hours: '9:00 AM - 2:00 PM' },
        sunday: { label: 'Domingo', hours: 'Cerrado (solo urgencias)' },
        emergency: { label: 'Urgencias', hours: '24/7 · 365 días', highlight: true },
      },
      social: {
        facebook: 'https://www.facebook.com/jose.m.rondon.5',
        instagram: 'https://www.instagram.com/joserondoon01/',
        twitter: '',
        tiktok: '',
      },
    },
  });

  console.log('✅ business_info actualizado con datos reales');
  const info = await prisma.businessInfo.findFirst();
  console.log('social:', JSON.stringify(info.social));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());