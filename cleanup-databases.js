const { Client } = require('pg');
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function cleanupAndRecreate() {
  console.log('🧹 Iniciando limpieza de bases de datos...');
  
  // Limpiar PostgreSQL
  console.log('🔄 Conectando a PostgreSQL...');
  const pgClient = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });
  
  try {
    await pgClient.connect();
    console.log('✅ Conectado a PostgreSQL');
    
    // Eliminar todas las tablas
    const dropTablesQuery = `
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS categories CASCADE; 
      DROP TABLE IF EXISTS category CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS product CASCADE;
      DROP TABLE IF EXISTS appointments CASCADE;
      DROP TABLE IF EXISTS reviews CASCADE;
      DROP TABLE IF EXISTS portfolio CASCADE;
      DROP TABLE IF EXISTS artists CASCADE;
    `;
    
    await pgClient.query(dropTablesQuery);
    console.log('🗑️ Tablas de PostgreSQL eliminadas');
  } catch (error) {
    console.log('⚠️ PostgreSQL Error:', error.message);
  } finally {
    await pgClient.end();
    console.log('📤 Desconectado de PostgreSQL');
  }

  // Limpiar MongoDB
  console.log('🔄 Conectando a MongoDB...');
  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await mongoClient.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = mongoClient.db();
    
    // Eliminar colecciones existentes
    const collections = ['users', 'categories', 'portfolio', 'reviews'];
    
    for (const collectionName of collections) {
      try {
        await db.collection(collectionName).drop();
        console.log(`🗑️ Colección '${collectionName}' eliminada`);
      } catch (error) {
        if (error.code === 26) { // NamespaceNotFound
          console.log(`ℹ️ Colección '${collectionName}' no existía`);
        } else {
          console.log(`⚠️ Error eliminando colección '${collectionName}':`, error.message);
        }
      }
    }
    
  } catch (error) {
    console.log('⚠️ MongoDB Error:', error.message);
  } finally {
    await mongoClient.close();
    console.log('📤 Desconectado de MongoDB');
  }

  console.log('🎉 Limpieza completada!');
  console.log('');
  console.log('📋 Estructura final:');
  console.log('   📊 PostgreSQL: products, appointments');
  console.log('   📄 MongoDB: users, categories');
  console.log('');
  console.log('🚀 Reinicia el servidor para recrear las estructuras.');
}

cleanupAndRecreate().catch(console.error);
