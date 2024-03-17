import textarea from "../models/textarea.js";


const addTextArea = async (req, res) => {
    const {title,content} = req.body;
    try {
        const newText = new textarea({
            userId: req.user._id,
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
        const text = await textarea.find({userId:req.user._id}).sort({updatedAt:-1});
        res.status(200).json({success:true, text});
    } catch (error) {
        res.status(404).json({success:false, message:error.message});
    }
}    

const getTextAreaInd  = async (req, res) => {
    try {
        const text = await textarea.findById(req.params.id).populate('EditAccessToUser');
        if(text.userId.toString() !== req.user._id.toString()){
            const canShare = false;
            res.status(200).json({success:true, canShare, text});
        }else{
            const canShare = true;
            res.status(200).json({success:true, canShare, text});
        }
    } catch (error) {
        res.status(404).json({success:false, message:error.message});
    } 
}

const EditedTextArea = async (req, res) => {
    const {title,content} = req.body;
    try {
        const text = await textarea.findByIdAndUpdate(req.params.id, {title,content,updatedAt: new Date().toISOString()},{new:true});
        if(text.userId.toString() === req.user._id.toString() || text.EditAccessToUser.includes(req.user._id)){
            text.title = title;
            text.content = content;
            await text.save();
            res.status(200).json({success:true, text});
        }else{
            res.status(401).json({success:false, message:"You are not authorized to edit this text"});
        }
    } catch (error) {
        res.status(404).json({success:false, message:error.message});
    }
}

const ShareWithUser = async (req, res) => {
    const {id} = req.params;
    const userIds = req.body.id;
    console.log(userIds);
    try {   
        const text = await textarea.findByIdAndUpdate(id, {$push : {EditAccessToUser : {$each : userIds}}},{new:true});
        if(text.userId.toString() === req.user._id.toString()){
            text.EditAccessToUser = userIds;
            await text.save();
            res.status(200).json({success:true, text});
        }
    } catch (error) {
        res.status(404).json({success:false, message:error.message});
    }
}

const GetSharedTextArea = async (req, res) => {
    try {
        const text = await textarea.find({EditAccessToUser : req.user._id}).sort({updatedAt:-1});
        res.status(200).json({success:true, text});
    } catch (error) {
        res.status(404).json({success:false, message:error.message});
    }
}

const deleteTextArea = async (req, res) => {
    const {id} = req.body;
    try {
        const text = await textarea.findByIdAndDelete(id);
        res.status(200).json({success:true, text});
    } catch (error) {
        res.status(404).json({success:false, message:error.message});
    }
}

const deleteSharedText = async (req, res) => {
    const id = req.user._id;
    try {
        const text = await textarea.updateMany( {userId : id}, {$pull : {EditAccessToUser : req.user._id}},{new:true});
        res.status(200).json({success:true, text});
    } catch (error) {
        res.status(404).json({success:false, message:error.message});
    }
}

const deleteUserText = async (req, res) => {
    const id = req.user._id;
    try {
        const text = await textarea.deleteMany({userId : id});
        res.status(200).json({success:true, text});
    } catch (error) {
        res.status(404).json({success:false, message:error.message});
    }
}

const RemoveAccess = async (req, res) => {
    const id = req.body.id;
    const removeuser = req.body.removeuser;
    try {
        const text = await textarea.findByIdAndUpdate(id, {$pull : {EditAccessToUser : removeuser}},{new:true});
        res.status(200).json({success:true, text});
    } catch (error) {
        console.log(error);
        res.status(404).json({success:false, message:error.message});
    }
}
 

export {addTextArea, getTextArea, getTextAreaInd, EditedTextArea,ShareWithUser, GetSharedTextArea, deleteTextArea , deleteSharedText, deleteUserText, RemoveAccess };