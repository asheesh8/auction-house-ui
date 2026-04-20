// Connects on start up, maybe change to connect in main
import mongoose from 'mongoose'
import 'dotenv/config'

//main().catch(err => console.log(err));

async function database() {
  //uses MONGO_URL for cloud deployments, falls back to individual env vars for local Docker
  const uri = process.env.MONGO_URL
    || `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST || '127.0.0.1'}:27017/auction_house?authSource=admin`

  return await mongoose.connect(uri)
}

export default database;