// Docs: https://node-postgres.com/

import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const client = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: 5432,
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'admin',
  database: process.env.POSTGRES_DB || 'auction_house',
})

export default client
