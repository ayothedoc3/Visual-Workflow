import type { Config } from 'drizzle-kit';

// Database URL (loaded from environment by drizzle-kit automatically)
// drizzle-kit reads from .env automatically
export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_dQ21iJkvpRhL@ep-dark-silence-a2al1i7l-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  },
} satisfies Config;
