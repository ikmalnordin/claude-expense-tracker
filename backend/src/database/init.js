const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');

    const schema = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf-8'
    );

    await pool.query(schema);
    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initializeDatabase();
