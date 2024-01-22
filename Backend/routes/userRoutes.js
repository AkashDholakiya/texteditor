import express from 'express';
import User from '../models/user.js';
import {
    register,
    login,
    getuser,
    EditUser,
    DeleteUser,
    ForgotPass,
    validateUser,
    ResetPassword,
    VerifyEmail,
    editprofileimage
} from '../controllers/userController.js';
import { verifyToken } from '../utils/verifyToken.js';
import multer from 'multer';    
import path from 'path';
import fs from 'fs';
const router = express.Router();

const uploadDirectory = './uploads/profilePics';
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory)
    },
    filename: function (req, file, cb) {
        const userId = req.user._id;
        const previousFileName = async () => {
            const user2 = await User.findById(userId);

            if(user2.profileimg != null && user2.profileimg != '' && user2.profileimg != undefined){
                fs.unlinkSync(uploadDirectory + "/" + user2.profileimg);
            }   
            else{
                console.log('No file to delete');
            } 
        } 

        previousFileName();

        cb(null, userId + '-' + file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }    
}) 
 
const upload = multer({ storage: storage }).single('profileimg')
 
router.post('/login', login);  
router.post('/register' ,register);
router.get('/getuser', verifyToken, getuser)
router.put('/edituser/:id', verifyToken, EditUser)
router.post('/updateprofileimage', verifyToken, upload, editprofileimage)
// router.get('/update/profileimage/', verifyToken, getuser)
router.delete('/deleteuser/:id', verifyToken, DeleteUser)
router.post('/forgot-password', ForgotPass)
router.get('/reset-password/:id/:token', validateUser)
router.post('/reset-password/:id/:token', ResetPassword)
router.get('/verify/:id/:token', validateUser)
router.post('/verify/:id/:token', VerifyEmail)
  
export default router;