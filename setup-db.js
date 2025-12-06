import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_Do1fLFSKXpr5@ep-dark-silence-a2al1i7l-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

const sql = readFileSync('./setup-db.sql', 'utf8');

async function setup() {
  try {
    console.log('Setting up database schema...');
    await pool.query(sql);
    console.log('✓ Database schema created successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setup();
