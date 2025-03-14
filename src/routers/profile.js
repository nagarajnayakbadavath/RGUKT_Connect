const express=require('express');
const userAuth=require('../middlewares/auth');
const profileRouter=express.Router();
const User=require('../models/user');
profileRouter.use(express.json());


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
        const user=req.user;
        console.log(user);
        res.send(user);
    }catch(err){
        res.status(400).send("Error :"+err.message);
    }
});

profileRouter.put("/profile/edit",userAuth,async(req,res)=>{
    try{
        const {firstName,lastName,about,skills,photourl}=req.body;
        if(!firstName || !lastName || !about || !skills || !photourl){
            return res.status(400).send("All fields are required");
        } 
        const user=await User.findById(req.user._id);
        if(!user){
            res.status(400).send("user not found yaar");
        }
        user.firstName=firstName;
        user.lastName=lastName;
        user.about=about;
        user.photourl=photourl;
        user.skills=skills;
        user.save();
        res.send(user);
    }catch(err){
        res.status(400).send(err.message);
    }
});

profileRouter.get("/user/profile/:id",async(req,res)=>{
    try{
        const id=req.params.id;
        const user=await User.findById(id);
        console.log("Hello");
        if(!user){
            res.status(400).send("user is not found with this id");
        }
        res.send(user);
    }catch(err){
        res.status(400).send(err.message);
    }
});
profileRouter.patch(".profile/forgotpassword",userAuth,async(req,res)=>{
    try{
        
    }catch(err){
        res.status(400).send(err.message);
    }
});

module.exports=profileRouter;