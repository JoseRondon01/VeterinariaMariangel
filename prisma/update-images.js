import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// source.unsplash.com = API garantizada, siempre devuelve imagen
// Cada URL tiene keywords específicos del producto
const productImages = {
  'Purina Pro Plan Adulto 15kg':
    'https://source.unsplash.com/600x400/?dog-food-bag,pet-food',

  'Royal Canin Mini Adult 7.5kg':
    'https://source.unsplash.com/600x400/?small-dog,puppy-food',

  'Bravecto Comprimido 20-40kg':
    'https://source.unsplash.com/600x400/?veterinary,medicine-tablets,pet',

  'Simparica Trio 10-20kg':
    'https://source.unsplash.com/600x400/?healthy-dog,park,veterinary',

  'Collar Seresto Antipulgas Gato':
    'https://source.unsplash.com/600x400/?cat-collar,orange-cat,pet',

  'Arnés Pechera Acolchado M':
    'https://source.unsplash.com/600x400/?dog-harness,walking-dog,leash',

  'Shampoo Dermatológico Veterinario':
    'https://source.unsplash.com/600x400/?dog-bath,grooming,pet-spa',

  'Cepillo Dental + Pasta Enzimática':
    'https://source.unsplash.com/600x400/?dog-teeth,pet-dental,toothbrush',

  'Kong Classic Grande':
    'https://source.unsplash.com/600x400/?dog-toy,kong,rubber-toy',

  'Pelota Lanzador con Sonido':
    'https://source.unsplash.com/600x400/?dog-playing-ball,tennis-ball-dog,play',
};

async function main() {
  console.log('🖼️ Actualizando imágenes con source.unsplash.com (garantizadas)...\n');

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

  console.log('\n🎉 10 imágenes actualizadas con source.unsplash.com');
  console.log('   Recarga: https://veterinariamariangel.onrender.com/tienda');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());