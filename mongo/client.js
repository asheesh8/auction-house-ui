// Connects on start up, maybe change to connect in main
import mongoose from 'mongoose';

main().catch(err => console.log(err));

async function database() {
  return await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

export default database;