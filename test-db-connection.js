#!/usr/bin/env node

/**
 * Script para probar la conectividad de las bases de datos
 * Usar antes del deploy para verificar que todo funciona
 */

const { createConnection } = require('typeorm');
const { MongoClient } = require('mongodb');
require('dotenv').config();

console.log('🔍 Verificando conectividad de bases de datos...\n');

// Test PostgreSQL (Neon)
async function testPostgreSQL() {
  console.log('📊 Probando PostgreSQL (Neon)...');
  
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });

    // Test simple query
    const result = await connection.query('SELECT version()');
    console.log('✅ PostgreSQL conectado exitosamente');
    console.log(`   Versión: ${result[0].version.split(' ')[1]}`);
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Base de datos: ${process.env.DB_NAME}`);
    
    await connection.close();
    return true;
  } catch (error) {
    console.log('❌ Error conectando a PostgreSQL:');
    console.log(`   ${error.message}`);
    return false;
  }
}

// Test MongoDB (Atlas)
async function testMongoDB() {
  console.log('\n🍃 Probando MongoDB (Atlas)...');
  
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    // Test connection
    const adminDb = client.db().admin();
    const status = await adminDb.ping();
    
    if (status.ok === 1) {
      console.log('✅ MongoDB conectado exitosamente');
      console.log(`   URI: ${process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@')}`);
      
      // Get database info
      const db = client.db();
      const collections = await db.listCollections().toArray();
      console.log(`   Colecciones disponibles: ${collections.length}`);
    }
    
    await client.close();
    return true;
  } catch (error) {
    console.log('❌ Error conectando a MongoDB:');
    console.log(`   ${error.message}`);
    return false;
  }
}

// Test JWT Secret
function testJWT() {
  console.log('\n🔐 Verificando configuración JWT...');
  
  if (!process.env.JWT_SECRET) {
    console.log('❌ JWT_SECRET no está configurado');
    return false;
  }
  
  if (process.env.JWT_SECRET.length < 16) {
    console.log('⚠️  JWT_SECRET es muy corto (recomendado: mínimo 32 caracteres)');
    return false;
  }
  
  console.log('✅ JWT_SECRET configurado correctamente');
  console.log(`   Longitud: ${process.env.JWT_SECRET.length} caracteres`);
  console.log(`   Expiración: ${process.env.JWT_EXPIRES_IN}`);
  return true;
}

// Test Email Config
function testEmail() {
  console.log('\n📧 Verificando configuración de email...');
  
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('❌ Configuración de email incompleta');
    return false;
  }
  
  console.log('✅ Configuración de email configurada');
  console.log(`   Usuario: ${process.env.GMAIL_USER}`);
  console.log(`   Password: ${'*'.repeat(process.env.GMAIL_APP_PASSWORD.length)}`);
  return true;
}

// Main execution
async function main() {
  const results = [];
  
  results.push(await testPostgreSQL());
  results.push(await testMongoDB());
  results.push(testJWT());
  results.push(testEmail());
  
  const successCount = results.filter(Boolean).length;
  const totalTests = results.length;
  
  console.log('\n📋 RESUMEN DE PRUEBAS:');
  console.log(`✅ Exitosas: ${successCount}/${totalTests}`);
  console.log(`❌ Fallidas: ${totalTests - successCount}/${totalTests}`);
  
  if (successCount === totalTests) {
    console.log('\n🎉 ¡Todas las pruebas pasaron! Tu aplicación está lista para deploy.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Hay problemas de configuración. Revisa los errores antes del deploy.');
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Error no manejado:', error.message);
  process.exit(1);
});

main();
