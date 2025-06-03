import 'src/pollyfill/compression-stream'
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from '@repo/env/backend';

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
