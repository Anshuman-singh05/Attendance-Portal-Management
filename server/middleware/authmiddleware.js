import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';


const protect= asyncHandler(async(req,res,next)=>{
    let token;

    token= req.cookies.jwt;
    // console.log('COOKIE SE MILA TOKEN:', token);

    if(token){
        try{
            // console.log('Token check karte time secret:', process.env.JWT_SECRET);
            const decoded= jwt.verify(token,process.env.JWT_SECRET);
            req.user= await User.findById(decoded.userId).select('-password');
            next();
        }catch (error){
            // console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }else{
        res.status(401);
        throw new Error('not authorized, no token');
    }
});

const isAdmin= asyncHandler(async(req,res,next)=>{
    if(req.user && req.user.role==='admin'){
        next();
    }else{
        res.status(403);
        throw new Error('Access denied: Admins only');
    }
});

export {protect, isAdmin};