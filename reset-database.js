const { Client } = require('pg');
require('dotenv').config();

async function resetDatabase() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true'
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // Drop all tables if they exist
    const dropTablesQuery = `
      DROP TABLE IF EXISTS "appointments" CASCADE;
      DROP TABLE IF EXISTS "artists" CASCADE;
      DROP TABLE IF EXISTS "products" CASCADE;
      DROP TABLE IF EXISTS "users" CASCADE;
      DROP TABLE IF EXISTS "migrations" CASCADE;
      DROP TABLE IF EXISTS "typeorm_metadata" CASCADE;
    `;

    await client.query(dropTablesQuery);
    console.log('✅ All tables dropped successfully');

    // Reset sequences if they exist
    const resetSequencesQuery = `
      DROP SEQUENCE IF EXISTS "appointments_id_seq" CASCADE;
      DROP SEQUENCE IF EXISTS "artists_id_seq" CASCADE;
      DROP SEQUENCE IF EXISTS "products_id_seq" CASCADE;
      DROP SEQUENCE IF EXISTS "users_id_seq" CASCADE;
    `;

    await client.query(resetSequencesQuery);
    console.log('✅ All sequences reset successfully');

    console.log('🎉 Database reset completed! You can now restart your application.');

  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
  } finally {
    await client.end();
  }
}

resetDatabase();
