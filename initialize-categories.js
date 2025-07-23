require('dotenv').config();
const { Client } = require('pg');

async function initializeCategories() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // Verificar si la tabla de categorías existe
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'categories'
      );
    `);

    console.log('🔍 Tabla categories existe:', tableExists.rows[0].exists);

    if (!tableExists.rows[0].exists) {
      // Crear la tabla si no existe
      await client.query(`
        CREATE TABLE categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          icono VARCHAR(255),
          activa BOOLEAN DEFAULT true,
          orden INTEGER DEFAULT 0,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Tabla categories creada');
    }

    // Verificar cuántas categorías hay
    const count = await client.query('SELECT COUNT(*) FROM categories');
    console.log('📊 Categorías existentes:', count.rows[0].count);

    if (parseInt(count.rows[0].count) === 0) {
      // Insertar categorías de ejemplo
      const categories = [
        { name: 'Máquinas', description: 'Máquinas de tatuar y equipos principales', icono: '⚙️', orden: 1 },
        { name: 'Agujas', description: 'Agujas y cartuchos para tatuar', icono: '🔹', orden: 2 },
        { name: 'Tintas', description: 'Tintas de colores y pigmentos', icono: '🎨', orden: 3 },
        { name: 'Protección', description: 'Equipos de protección e higiene', icono: '🛡️', orden: 4 },
        { name: 'Electrónicos', description: 'Fuentes de poder y accesorios electrónicos', icono: '⚡', orden: 5 },
        { name: 'Cuidado', description: 'Productos de cuidado y aftercare', icono: '💊', orden: 6 }
      ];

      for (const cat of categories) {
        await client.query(
          'INSERT INTO categories (name, description, icono, activa, orden) VALUES ($1, $2, $3, $4, $5)',
          [cat.name, cat.description, cat.icono, true, cat.orden]
        );
      }
      
      console.log('✅ Categorías de ejemplo insertadas');
    }

    // Mostrar todas las categorías
    const allCategories = await client.query('SELECT * FROM categories ORDER BY orden ASC');
    console.log('📋 Categorías en base de datos:');
    allCategories.rows.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.icono}) - Orden: ${cat.orden}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

// Solo ejecutar si es llamado directamente
if (require.main === module) {
  initializeCategories();
}

module.exports = { initializeCategories };
