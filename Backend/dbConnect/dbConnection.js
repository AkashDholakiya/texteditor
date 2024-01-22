import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.DB_CONNECT;
const dbconn = async () => {
    try {
        await mongoose.connect(uri);
    } catch (err) {
        console.log(err);
    }
}

export default dbconn;