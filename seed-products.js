const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const sampleProducts = [
  {
    nombre: 'Máquina de Tatuaje Rotativa Pro',
    descripcion: 'Máquina rotativa profesional de alta calidad para líneas y sombreado. Motor silencioso y ergonómico.',
    precio: 150.00,
    stock: 25,
    marca: 'TattooTech',
    modelo: 'RT-Pro-2024',
    especificaciones: 'Motor rotativo, 7000-12000 RPM, Peso: 120g',
    imagenes: JSON.stringify(['/images/products/maquina-rotativa-1.jpg']),
    disponible: true,
    activo: true,
    destacado: true,
    descuento: 0,
    sku: 'MAQ-ROT-001',
    peso: 0.12,
    dimensiones: '15x3x3 cm',
    categoria_id: 1
  },
  {
    nombre: 'Set de Agujas Desechables 50pcs',
    descripcion: 'Set completo de agujas desechables estériles. Diferentes configuraciones para líneas y sombreado.',
    precio: 35.00,
    stock: 100,
    marca: 'SterilNeedle',
    modelo: 'SN-MIX-50',
    especificaciones: 'Acero inoxidable 316L, estériles, desechables',
    imagenes: JSON.stringify(['/images/products/agujas-set-1.jpg']),
    disponible: true,
    activo: true,
    destacado: false,
    descuento: 10,
    sku: 'AGU-SET-001',
    peso: 0.05,
    dimensiones: '20x15x2 cm',
    categoria_id: 2
  },
  {
    nombre: 'Tinta Negra Premium 30ml',
    descripcion: 'Tinta negra de alta calidad para tatuajes. Fórmula vegana, libre de crueldad animal.',
    precio: 25.00,
    stock: 75,
    marca: 'InkMaster',
    modelo: 'IM-BLACK-30',
    especificaciones: 'Base vegana, 30ml, color negro intenso',
    imagenes: JSON.stringify(['/images/products/tinta-negra-1.jpg']),
    disponible: true,
    activo: true,
    destacado: true,
    descuento: 0,
    sku: 'TIN-NEG-001',
    peso: 0.03,
    dimensiones: '5x5x8 cm',
    categoria_id: 3
  },
  {
    nombre: 'Guantes Nitrilo Negro 100pcs',
    descripcion: 'Guantes de nitrilo negro, sin polvo, resistentes y cómodos. Ideales para sesiones largas.',
    precio: 18.00,
    stock: 200,
    marca: 'SafeHands',
    modelo: 'SH-NITRILE-100',
    especificaciones: 'Nitrilo, sin polvo, talla M, color negro',
    imagenes: JSON.stringify(['/images/products/guantes-nitrilo-1.jpg']),
    disponible: true,
    activo: true,
    destacado: false,
    descuento: 5,
    sku: 'GUA-NIT-001',
    peso: 0.2,
    dimensiones: '25x15x10 cm',
    categoria_id: 4
  },
  {
    nombre: 'Fuente de Poder Digital',
    descripción: 'Fuente de poder digital con pantalla LCD. Control preciso de voltaje y ajustes guardados.',
    precio: 120.00,
    stock: 15,
    marca: 'PowerTech',
    modelo: 'PT-DIGITAL-V2',
    especificaciones: 'Display LCD, 0-18V, memoria de configuraciones',
    imagenes: JSON.stringify(['/images/products/fuente-poder-1.jpg']),
    disponible: true,
    activo: true,
    destacado: true,
    descuento: 0,
    sku: 'FUE-DIG-001',
    peso: 0.8,
    dimensiones: '20x15x8 cm',
    categoria_id: 5
  },
  {
    nombre: 'Crema Anestésica Tópica 30g',
    descripcion: 'Crema anestésica para reducir el dolor durante el tatuaje. Fórmula de larga duración.',
    precio: 15.00,
    stock: 60,
    marca: 'PainFree',
    modelo: 'PF-CREAM-30',
    especificaciones: '5% lidocaína, 30g, uso tópico',
    imagenes: JSON.stringify(['/images/products/crema-anestesica-1.jpg']),
    disponible: true,
    activo: true,
    destacado: false,
    descuento: 0,
    sku: 'CRE-ANE-001',
    peso: 0.04,
    dimensiones: '8x3x15 cm',
    categoria_id: 6
  }
];

async function seedProducts() {
  const client = await pool.connect();
  try {
    console.log('🌱 Iniciando inserción de productos de ejemplo...');
    
    // Verificar si ya existen productos
    const existingProducts = await client.query('SELECT COUNT(*) FROM products');
    const productCount = parseInt(existingProducts.rows[0].count);
    
    if (productCount > 0) {
      console.log(`⚠️  Ya existen ${productCount} productos en la base de datos.`);
      console.log('¿Deseas continuar? Los productos duplicados serán omitidos.');
    }

    let insertedCount = 0;
    
    for (const product of sampleProducts) {
      try {
        // Verificar si el SKU ya existe
        const existingSku = await client.query('SELECT id FROM products WHERE sku = $1', [product.sku]);
        
        if (existingSku.rows.length === 0) {
          const insertQuery = `
            INSERT INTO products (
              nombre, descripcion, precio, stock, marca, modelo, especificaciones,
              imagenes, disponible, activo, destacado, descuento, sku, peso, 
              dimensiones, categoria_id, created_at, updated_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 
              NOW(), NOW()
            )
          `;
          
          await client.query(insertQuery, [
            product.nombre,
            product.descripcion,
            product.precio,
            product.stock,
            product.marca,
            product.modelo,
            product.especificaciones,
            product.imagenes,
            product.disponible,
            product.activo,
            product.destacado,
            product.descuento,
            product.sku,
            product.peso,
            product.dimensiones,
            product.categoria_id
          ]);
          
          insertedCount++;
          console.log(`✅ Producto insertado: ${product.nombre}`);
        } else {
          console.log(`⏭️  Producto ya existe: ${product.nombre} (SKU: ${product.sku})`);
        }
      } catch (error) {
        console.error(`❌ Error insertando ${product.nombre}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Proceso completado! ${insertedCount} productos nuevos insertados.`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar el script
seedProducts();
