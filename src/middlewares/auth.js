
const User=require('../models/user');
const jwt=require('jsonwebtoken');

const userAuth=async(req,res,next)=>{
    //get the cookie form response
    
    try{
    const {token}=req.cookies;
    if(!token){
        throw new Error("token is invalid or null");
    }
    const obj=jwt.verify(token,"rgukt@connects$790");
    const {_id}=obj;
    const user=await User.findById(_id);
    if(!user){
        throw new Error("user is not found");
    }
    req.user=user;
    next();
    }catch(err){
        res.status(400).send(err.message);
    }
}

module.exports=userAuth;