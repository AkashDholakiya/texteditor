import mongoose from "mongoose";

const textareaSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    EditAccessToUser : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    title: {
        type: String,
        required: true, 
    },
    content:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Textarea", textareaSchema);