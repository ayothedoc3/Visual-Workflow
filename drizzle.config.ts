import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Do1fLFSKXpr5@ep-dark-silence-a2al1i7l-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  },
} satisfies Config;
