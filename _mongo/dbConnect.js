// For Connect with MongoDB -> this is all

//require('dotenv').config()

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI


if(!MONGODB_URI) {
    throw new Error(
        
    )
}
console.log(MONGODB_URI)
let cached = global.mongoose
if(!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    }
}

async function dbConnect() {
    if(cached.conn) {
        return cached.conn
    }

    if(!cached.promise) {
        const opts = {
            bufferCommands: true,
        }

        cached.promise = mongoose.connect( MONGODB_URI, opts).then((mongoose) => {
            return mongoose
        })
    }

    cached.conn = await cached.promise
    return cached.conn
}

export default dbConnect