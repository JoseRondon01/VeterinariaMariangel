import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  let info = await prisma.businessInfo.findFirst();
  if (!info) {
    info = await prisma.businessInfo.create({
      data: {
        businessName: 'Veterinaria Mariangel',
        phone: '+54 11 2725 8138',
        whatsappNumber: '541127258138',
        email: 'contacto@veterinariamariangel.com',
        schedule: {},
        social: {},
      },
    });
  } else {
    info = await prisma.businessInfo.update({
      where: { id: info.id },
      data: {
        whatsappNumber: '541127258138',
        phone: '+54 11 2725 8138',
      },
    });
  }
  console.log('✅ WhatsApp actualizado:', info.whatsappNumber, '| Teléfono:', info.phone);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); prisma.$disconnect(); });