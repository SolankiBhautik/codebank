import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()


const url = process.env.MONGODB_URL || ''

try {
    await mongoose.connect(url);
    mongoose.set('bufferCommands', false);
} catch (err) {
    console.error("mongo db connection failed: ", err)
} 