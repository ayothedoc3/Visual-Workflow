import { Pool } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

// Database URL (hardcoded for migration)
const DATABASE_URL = 'postgresql://neondb_owner:npg_dQ21iJkvpRhL@ep-dark-silence-a2al1i7l-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function runMigration() {
  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    console.log('🔌 Connecting to database...');

    // Read SQL file
    const sqlPath = path.join(process.cwd(), 'migrations', '001_create_3_layer_system.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    console.log('📄 Running migration: 001_create_3_layer_system.sql');

    // Execute SQL
    await pool.query(sql);

    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('Created tables:');
    console.log('  - campaigns (Layer 1)');
    console.log('  - playbooks (Layer 2)');
    console.log('  - executions (Layer 3)');
    console.log('  - tasks');
    console.log('  - blockers');
    console.log('  - resources');

  } catch (error) {
    console.error('❌ Migration failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
