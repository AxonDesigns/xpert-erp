import { env } from '@repo/env/backend'
import app from '@backend/app';

export default {
  port: env.BACKEND_PORT,
  host: env.BACKEND_HOST,
  fetch: app.fetch,
}
