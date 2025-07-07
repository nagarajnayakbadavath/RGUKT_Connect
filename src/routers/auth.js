const express=require('express');
require('dotenv').config();
const jwt_secret_key=process.env.JWT_SECRET_KEY;

const authRouter=express.Router();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const User=require('../models/user');
authRouter.use(express.json());
const {validateSignupData}=require('../utils/validation');

const cookieParser = require("cookie-parser");
authRouter.use(cookieParser());

authRouter.post("/signup",async(req,res)=>{
    try{
    // validateSignupData(req);
    const {firstName,lastName,emailId,password,about}=req.body;
    const passwordHash=await bcrypt.hash(password,10); 
    const user=new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
        about,
    });
    await user.save();
    res.status(200).send(user);
    }catch(err){
        res.status(400).send("not enetered the user");
    }
});

authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const newuser=await User.findOne({emailId});
        if(!newuser){
            throw new Error("user not found");
        }
        const isPasswordValid=await bcrypt.compare(password,newuser.password);
        if(isPasswordValid){
            const token=jwt.sign({_id:newuser._id},`${jwt_secret_key}`);
            res.cookie("token",token);
            res.send({newuser,token});
        }else{
            return res.status(401).json({ message: "Invalid email or password" });
        }
    }catch(err){
        res.status(401).send(err.message);
    }
});

authRouter.post("/logout",async(req,res)=>{
    try{
        res.cookie("token",null,{
            expires:new Date(Date.now()),
        });
        res.send("logged out successfully");
    }catch(err){
        res.status(400).send(err);
    }
});



module.exports=authRouter;