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
        console.log(decoded);
        req.user = decoded.id;
        next();
    } catch (error) { 
        return res.status(401).json({success:false, message:"Unauthorized"});
    }
}

export {verifyToken};