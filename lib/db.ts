import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

// Normalize DATABASE_URL and guard against invalid strings (e.g., "psql '...url...'")
export function getDatabaseUrl(): string | null {
  let raw = process.env.DATABASE_URL;
  if (!raw) return null;

  let url = raw.trim();
  if (url.toLowerCase().startsWith('psql ')) {
    url = url.slice(5).trim();
  }
  if (url.startsWith("'") && url.endsWith("'")) {
    url = url.slice(1, -1);
  }

  try {
    // Validate URL shape
    // eslint-disable-next-line no-new
    new URL(url);
    return url;
  } catch {
    return null;
  }
}

let cachedPool: Pool | null = null;
let cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (cachedDb) return cachedDb;

  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured or invalid');
  }

  if (!cachedPool) {
    cachedPool = new Pool({ connectionString });
  }

  cachedDb = drizzle(cachedPool, { schema });
  return cachedDb;
}
