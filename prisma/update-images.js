import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cada imagen seleccionada específicamente para el producto
const productImages = {
  'Purina Pro Plan Adulto 15kg':
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop',

  'Royal Canin Mini Adult 7.5kg':
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop',

  'Bravecto Comprimido 20-40kg':
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',

  'Simparica Trio 10-20kg':
    'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600&h=400&fit=crop',

  'Collar Seresto Antipulgas Gato':
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop',

  'Arnés Pechera Acolchado M':
    'https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&h=400&fit=crop',

  'Shampoo Dermatológico Veterinario':
    'https://images.unsplash.com/photo-1583511655857-d19bde84a6e1?w=600&h=400&fit=crop',

  'Cepillo Dental + Pasta Enzimática':
    'https://images.unsplash.com/photo-1589924691995-400dc2607991?w=600&h=400&fit=crop',

  'Kong Classic Grande':
    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=400&fit=crop',

  'Pelota Lanzador con Sonido':
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=400&fit=crop',
};

async function main() {
  console.log('🖼️ Actualizando imágenes de productos...\n');

  for (const [name, imageUrl] of Object.entries(productImages)) {
    const product = await prisma.product.findFirst({ where: { name } });
    if (product) {
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl },
      });
      console.log(`  ✅ ${name}`);
    }
  }

  console.log('\n🎉 10 imágenes actualizadas! Recarga https://veterinariamariangel.onrender.com/tienda');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());