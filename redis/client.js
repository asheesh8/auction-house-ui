// Docs: https://github.com/redis/ioredis

import Redis from 'ioredis'
import 'dotenv/config'

//create REDIS CONNECTION using env variables.
//uses REDIS_URL for cloud deployments, falls back to host/port for local Docker
const client = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    })

//log when REDIS connects SUCCESSFULLY or throws a ERROR
client.on('connect', () => console.log('redis is connected'))
client.on('error', (err) => console.error('redis has an error: ', err))

export default client