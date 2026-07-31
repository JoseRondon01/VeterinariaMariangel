import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Estableciendo todas las imágenes a null...\n');

  // Poner todas las imágenes a null para activar el fallback del ProductCard
  const result = await prisma.product.updateMany({
    data: { imageUrl: null },
  });

  console.log(`  ✅ ${result.count} productos actualizados (imageUrl = null)`);
  console.log('\n📸 El ProductCard mostrará un gradiente con ícono por defecto.');
  console.log('   Para añadir imágenes reales, sube fotos a client/public/products/');
  console.log('   y actualiza la BD con rutas como: /products/purina-pro-plan.png');
  console.log('\n   Recarga: https://veterinariamariangel.onrender.com/tienda');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());