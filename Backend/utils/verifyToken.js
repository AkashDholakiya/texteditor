import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyToken = (req,res,next) => {
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).json({success:false, message:"Unauthorized"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) { 
        return res.status(401).json({success:false, message:"Unauthorized"});
    }
}

const verifyAdmin = (req,res,next) => {
    TokenVerify(req,res,next , () => {
        if(req.user.role !== "admin"){
            return res.status(401).json({success:false, message:"Unauthorized"});
        }
        next();
    });
}

const verifyUser = (req,res,next) => {
    TokenVerify(req,res,next , () => {
        if(req.user.id === req.params.id || req.user.role === "user"){
            next();
        }else{
            return res.status(401).json({success:false, message:"Unauthorized"});
        }
    });
}

export {verifyToken, verifyAdmin, verifyUser};