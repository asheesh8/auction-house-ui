// Docs: https://node-postgres.com/

import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

//uses DATABASE_URL for cloud deployments (Railway, Heroku, Supabase, etc.)
//falls back to individual env vars for local Docker
const client = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: 5432,
        user: process.env.POSTGRES_USER || 'admin',
        password: process.env.POSTGRES_PASSWORD || 'admin',
        database: process.env.POSTGRES_DB || 'auction_house',
      }
)

export default client
