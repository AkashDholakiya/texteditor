import textarea from "../models/textarea.js";


const addTextArea = async (req, res) => {
    const {title,content} = req.body;
    try {
        const newText = new textarea({
            userId:req.user.id,
            EditAccessToUser:req.user.id,
            title,
            content,
        });
        await newText.save();
        res.status(201).json({success:true, newText});
    } catch (error) {
        res.status(409).json({success:false, message:error.message});
    }
}

const getTextArea  = async (req, res) => {
    try {
        const text = await textarea.find({userId:req.user.id});
        res.status(200).json({success:true, text});
    } catch (error) {
        res.status(404).json({success:false, message:error.message});
    }
}    

export {addTextArea, getTextArea};