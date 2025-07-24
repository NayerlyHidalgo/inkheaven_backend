const { MongoClient } = require('mongodb');
require('dotenv').config();

async function createDefaultCategories() {
  console.log('🌱 Creando categorías por defecto en MongoDB...');
  
  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await mongoClient.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = mongoClient.db();
    const categoriesCollection = db.collection('categories');
    
    const defaultCategories = [
      {
        name: 'Máquinas',
        description: 'Máquinas de tatuar profesionales y accesorios',
        icono: '⚙️',
        activa: true,
        orden: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Agujas',
        description: 'Agujas y cartuchos para tatuaje',
        icono: '🔹',
        activa: true,
        orden: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tintas',
        description: 'Tintas de alta calidad en diversos colores',
        icono: '🎨',
        activa: true,
        orden: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Protección',
        description: 'Equipos de protección e higiene',
        icono: '🛡️',
        activa: true,
        orden: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Electrónicos',
        description: 'Fuentes de poder y accesorios electrónicos',
        icono: '⚡',
        activa: true,
        orden: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cuidado',
        description: 'Productos de cuidado y cicatrización',
        icono: '💊',
        activa: true,
        orden: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insertar categorías
    const result = await categoriesCollection.insertMany(defaultCategories);
    console.log(`✅ Insertadas ${result.insertedCount} categorías por defecto`);
    
    // Mostrar las categorías creadas
    const categories = await categoriesCollection.find({}).toArray();
    console.log('\n📋 Categorías creadas:');
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.icono} ${cat.name} - ${cat.description}`);
    });
    
  } catch (error) {
    console.log('⚠️ Error:', error.message);
  } finally {
    await mongoClient.close();
    console.log('📤 Desconectado de MongoDB');
  }
}

createDefaultCategories().catch(console.error);
