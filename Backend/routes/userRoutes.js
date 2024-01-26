import express from 'express';
// import User from '../models/user.js';
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
    alluser
} from '../controllers/userController.js';
import { verifyToken } from '../utils/verifyToken.js';
const router = express.Router();
 
router.post('/login', login);  
router.get('/search-user',verifyToken,alluser);
router.post('/register' ,register);
router.get('/getuser', verifyToken, getuser)
router.put('/edituser/:id', verifyToken, EditUser) 
router.delete('/deleteuser', verifyToken, DeleteUser)
router.post('/forgot-password', ForgotPass)
router.get('/reset-password/:id/:token', validateUser).post('/reset-password/:id/:token', ResetPassword)
router.get('/verify/:id/:token', validateUser).post('/verify/:id/:token', VerifyEmail)
   
export default router; 