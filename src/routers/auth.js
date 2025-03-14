const express=require('express');
const authRouter=express.Router();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const User=require('../models/user');
authRouter.use(express.json());
const {validateSignupData}=require('../utils/validation');

authRouter.post("/signup",async(req,res)=>{
    try{
    validateSignupData(req);
    const {firstName,lastName,emailId,password,about,photourl,skills}=req.body;
    const passwordHash=await bcrypt.hash(password,10); 
    const user=new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
        about,
        skills,
        photourl,
    });
    await user.save();
    res.send(user);
    }catch(err){
        res.status(400).send(err.message);
    }
});

// authRouter.post("/login",async(req,res)=>{
//     try{
//         const {emailId,password}=req.body;
//         const newuser=await User.findOne({emailId});
//         if(!newuser){
//             throw new Error("user not found");
//         }
//         const isPasswordValid=await bcrypt.compare(password,newuser.password);
//         if(isPasswordValid){
//             const token=jwt.sign({_id:newuser._id},"rgukt@connects$790");
//             res.cookie("token",token);
//             res.send(newuser);
//         }else{
//             res.send("login unsuccessfull");
//         }
//     }catch(err){
//         res.status(400).send(err.message);
//     }
// });

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const newuser = await User.findOne({ emailId });

        if (!newuser) {
            throw new Error("user not found");
        }

        const isPasswordValid = await bcrypt.compare(password, newuser.password);

        if (isPasswordValid) {
            const token = jwt.sign({ _id: newuser._id }, "rgukt@connects$790");

            // Set cookie with proper options
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,        // Important on Vercel (HTTPS)
                sameSite: 'None',    // Allow frontend from another origin
                maxAge: 24 * 60 * 60 * 1000 // 1 day in ms (optional)
            });

            res.status(200).send(newuser);
        } else {
            res.status(401).send("Login unsuccessful");
        }
    } catch (err) {
        res.status(400).send(err.message);
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

authRouter.get("/users",async(req,res)=>{
    try{
        const user=await User.find();
        console.log(user);
        res.send(user);
    }catch(err){
        res.status(400).send(err.message);
    }
});

module.exports=authRouter;