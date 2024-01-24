import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    verifyEmail:{
        type: Boolean,
        default: false,
    }, 
    password:{       
        type: String,
        required: true,
    },
    verifytoken:{
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
 
export default mongoose.model("User", userSchema);