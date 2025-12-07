import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('Testing database connection...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 30));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function test() {
  try {
    console.log('Connecting to database...');
    const result = await pool.query('SELECT 1 as test');
    console.log('✓ Database connection successful!');
    console.log('Result:', result.rows);
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

test();
