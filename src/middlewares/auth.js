
const User=require('../models/user');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const jwt_secret_key=process.env.JWT_SECRET_KEY;

const userAuth=async(req,res,next)=>{
    //get the cookie form response
    
    try{
    // const {token}=req.cookies;
    let token = req.cookies.token;
    console.log("The token we are getting from fe is",token);
    if(!token){
        const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1]; // Extract token after 'Bearer '
            }
    }

    if (!token) {
        throw new Error("Token is invalid or null");
    }

    const obj=jwt.verify(token,`${jwt_secret_key}`);
    const {_id}=obj;
    const user=await User.findById(_id);
    if(!user){
        throw new Error("user is not found");
    }
    console.log(user);
    req.user=user;
    next();
    }catch(err){
        res.status(400).send(err.message);
    }
}

module.exports=userAuth;