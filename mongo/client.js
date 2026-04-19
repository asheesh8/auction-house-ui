// Connects on start up, maybe change to connect in main
import mongoose from 'mongoose'
import 'dotenv/config'

//main().catch(err => console.log(err));

async function database() {
  const user = process.env.MONGO_USER
  const password = process.env.MONGO_PASSWORD

  const host = process.env.MONGO_HOST || '127.0.0.1'
  return await mongoose.connect(`mongodb://${user}:${password}@${host}:27017/test?authSource=admin`)
}

export default database;