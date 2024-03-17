import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import schedule from 'node-schedule';
import dotenv from 'dotenv';
const JWT_SECRET = process.env.JWT_SECRET;
import nodemailer from 'nodemailer';

dotenv.config();

schedule.scheduleJob('*/1 * * * *', async () => {
    const oneHoursAgo = new Date();
    oneHoursAgo.setHours(oneHoursAgo.getHours() - 1);
    // console.log(oneHoursAgo.toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}));
    await User.deleteMany({verifyEmail: false,createdAt: { $lte: oneHoursAgo } });
    // console.log(dateObj.toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}));
});

const register = async (req, res) => {
    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword, 
        })

        if (!newUser) {
            return res.status(400).json({ success: false, message: "Cannot create new user" });
        }
        const data = {
            user: {
                id: newUser._id,
            }
        }
        const token = jwt.sign(data, process.env.JWT_SECRET || JWT_SECRET, { expiresIn: "1d" });

        const setusertoken = await User.findByIdAndUpdate({_id:newUser._id},{verifytoken:token},{new:true})

        if(setusertoken){
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_PASSWORD
                }
            });

            var mailOptions = {
                from: process.env.USER_EMAIL,
                to: req.body.email,
                subject: 'Account Verification',
                html: `
                <h2>Account Verification</h2>
                <p>Click on the link to verify your account</p>
                <a href="http://localhost:3000/verify/${newUser._id}/${token}">Click Here to verify your account</a>
                <h3>&#169; all right reserved</h3>`
            };        

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ success: false, message: "Failed To send Email", error: error.message });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).json({ success: true, message: "Email Sent Successfully" });
                }
            });
        }

        res.status(200).json({ success: true, token, username: req.body.username, message: "User has been registered successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { nameemail, password  } = req.body;
        let user;
        if (nameemail.includes('@')) { // email
            user = await User.findOne({ email: nameemail, });
        } else { // userName
            user = await User.findOne({ username: nameemail, });
        }
        if (!user) {
            return res.status(404).json({ success: false, message: "Please Login with correct credential" });
        }

        if(!user.verifyEmail){
            return res.status(401).json({ success: false, message: "Please verify your email" });
        }
        const checkPass = await bcrypt.compare(password, user.password);
        if (!checkPass) {
            return res.status(401).json({ success: false, message: "Please Login with correct credential" });
        } 

        const token = jwt.sign({ user, id: user._id}, process.env.JWT_SECRET || JWT_SECRET, { expiresIn: "15d" });
        
        res.status(200).json({ success: true, token, message: "User has been logged in successfully", data: { id: user._id,profileimg:user.profileimg, username: user.username, email: user.email } });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed To login", error: error.message });
    }
}

const EditUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.findByIdAndUpdate(req.params.id, {
            username: username,
            email: email,
            password: hashedPassword
        }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User has been updated successfully", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed To update", error: error.message });
    }
}

// const editprofileimage = async (req, res) => { 
//     // console.log(req.file);
//     try {
//         const fileName = req.file.filename;  
//         const user = await User.findByIdAndUpdate(req.user._id, {
//             profileimg: fileName
//         }, { new: true }); 
//         if (!user) {    
//             return res.status(404).json({ success: false, message: "User not found" });
//         }
//         res.status(200).json({ success: true, message: "User has been updated successfully", data: user });
//     }
//     catch (error) {
//         res.status(500).json({ success: false, message: "Failed To update", error: error.message });
//     } 
// }


const DeleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User has been deleted successfully", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed To delete", error: error.message });
    }
}

const getuser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User has been fetched successfully", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed To fetch", error: error.message });
    }
}

const ForgotPass = async (req, res) => {
    const { email  } = req.body;
    try {
        const user = await User.findOne({ email: email, });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET || JWT_SECRET, { expiresIn: "300s" });
    
        const setusertoken = await User.findByIdAndUpdate({_id:user._id},{verifytoken:token},{new:true})
    
    
        if(setusertoken){
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_PASSWORD
                }
            });
    
            var mailOptions = {
                from: process.env.USER_EMAIL,
                to: email,
                subject: 'Reset Password',
                html: `
                <h4>Reset Password</h4>
                <p>This Link is valid for 5 minutes</p>
                <a href="http://localhost:3000/reset-password/${user._id}/${setusertoken.verifytoken}">Click Here to reset your password</a>
                <p>&#169; all right reserved</p>`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ success: false, message: "Failed To send Email", error: error.message });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).json({ success: true, message: "Email Sent Successfully" });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed To send Email", error: error.message });
    }

}

const validateUser = async (req,res) => {
    const { id, token } = req.params;
    try {
        const user = await User.findOne({_id:id,verifytoken:token});

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
        if(!user || !verifyToken){
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, message: "User has been fetched successfully", data: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed To fetch", error: error.message });
    }
}

const ResetPassword = async (req,res) => {
    const { id, token } = req.params;
    const { password } = req.body;
    try {
        const user = await User.findOne({_id:id,verifytoken:token});

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
        if(!user || !verifyToken){
            console.log("User not found");
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log("User found");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const setpassword = await User.findByIdAndUpdate({_id:id},{password:hashedPassword,verifytoken:null});

        if(!setpassword){
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, message: "User has been fetched successfully"});
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed To fetch", error: error.message });
    }
}

const VerifyEmail = async (req,res) => {
    const {id,token} = req.params;
    try {
        const user = await User.findOne({_id:id,verifytoken:token});

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
        if(!user || !verifyToken){
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const setverify = await User.findByIdAndUpdate({_id:id},{verifytoken:null,verifyEmail:true});

        if(!setverify){
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, message: "User has been fetched successfully"});
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed To fetch", error: error.message });
    }
}

const alluser = async (req,res) => {
    try {
        const key = req.query.search ? {
            $or: [
                { username: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
            ],
        }
        : {};
        const user = await User.find({...key}).find({_id:{$ne:req.user._id}});
        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, message: "User has been fetched successfully",data:user});
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed To fetch", error: error.message });
    }
}

export { register, login, getuser, EditUser, DeleteUser, ForgotPass, validateUser, ResetPassword, VerifyEmail, alluser };