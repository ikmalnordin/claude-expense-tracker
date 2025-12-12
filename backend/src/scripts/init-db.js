const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function initializeDatabase() {
  try {
    console.log('🔧 Checking database schema...');

    // Check if expenses table exists
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'expenses'
      );
    `);

    const tableExists = checkTable.rows[0].exists;

    if (!tableExists) {
      console.log('📋 Creating database schema...');

      // Read and execute schema.sql
      const schemaPath = path.join(__dirname, '../database/schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');

      await pool.query(schema);

      console.log('✅ Database schema created successfully');
    } else {
      console.log('✅ Database schema already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  }
}

module.exports = initializeDatabase;
