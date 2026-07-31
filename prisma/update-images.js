import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapeo: nombre del producto → archivo de imagen en /products/
const productImageMap = {
  'Purina Pro Plan Adulto 15kg': '/products/pro%20plan.png',
  'Royal Canin Mini Adult 7.5kg': '/products/royal.png',
  'Bravecto Comprimido 20-40kg': '/products/bravecto.png',
  'Simparica Trio 10-20kg': '/products/simpirica.png',
  'Collar Seresto Antipulgas Gato': '/products/seresto.png',
  'Arnés Pechera Acolchado M': '/products/arnes.png',
  'Shampoo Dermatológico Veterinario': '/products/champoo.png',
  'Cepillo Dental + Pasta Enzimática': '/products/cepillo.png',
  'Kong Classic Grande': '/products/kong.png',
  'Pelota Lanzador con Sonido': '/products/pelota.png',
};

async function main() {
  console.log('🖼️ Asociando imágenes reales a cada producto...\n');

  for (const [name, imageUrl] of Object.entries(productImageMap)) {
    const product = await prisma.product.findFirst({ where: { name } });
    if (product) {
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl },
      });
      console.log(`  ✅ ${name.padEnd(42)} → ${imageUrl}`);
    } else {
      console.log(`  ⚠️ No encontrado: ${name}`);
    }
  }

  console.log('\n🎉 10 productos con imágenes reales!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());