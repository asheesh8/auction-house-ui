import express from 'express'
import session from 'express-session'
import { createClient } from 'redis'
import { RedisStore } from 'connect-redis'
import fs from 'fs'
import 'dotenv/config'

// ensure the uploads directory exists before serving static files
fs.mkdirSync('./public/uploads', { recursive: true })

import { run as runBidProcessor } from './kafka/bidProcessor.js'
import authRoutes from './routes/auth.js'
import auctionRoutes from './routes/auctions.js'

const app = express()

// Redis client for session store (separate from ioredis client used elsewhere)
// use REDIS_URL for cloud (Upstash etc), fall back to host/port for local Docker
const sessionRedis = process.env.REDIS_URL
    ? createClient({ url: process.env.REDIS_URL })
    : createClient({
        socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
        }
    })
await sessionRedis.connect()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// serve uploaded auction images
app.use('/uploads', express.static('./public/uploads'))
app.set('view engine', 'ejs')
app.set('views', './views')

app.use(session({
    store: new RedisStore({ client: sessionRedis }),
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 4 }, // 4 hour session
}))

await runBidProcessor()

app.use('/', authRoutes)
app.use('/', auctionRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`auction house running at http://localhost:${PORT}`))
