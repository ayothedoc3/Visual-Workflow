import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
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
