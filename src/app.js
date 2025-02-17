const express=require('express');
const connectdb=require('./config/database');
const bcrypt=require('bcrypt');
const User=require('./models/user');
const app=express();
app.use(express.json());
const port=3000;
const jwt=require('jsonwebtoken');
const cookieParser = require("cookie-parser");
app.use(cookieParser());


app.get("/",(req,res)=>{
    res.send("Hello World!");
});

app.post("/signup",async(req,res)=>{
    try{
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
    res.send(user);
    }catch(err){
        res.status(400).send("not enetered the user");
    }
});

app.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const newuser=await User.findOne({emailId});
        if(!newuser){
            throw new Error("user not found");
        }
        const isPasswordValid=await bcrypt.compare(password,newuser.password);
        if(isPasswordValid){
            const token=jwt.sign({_id:newuser._id},"rgukt@connects$790");
            console.log("1");
            res.cookie("token",token);
            res.send(newuser);
        }else{
            res.send("login unsuccessfull");
        }
    }catch(err){
        res.status(400).send(err);
    }
});

app.post("/logout",async(req,res)=>{
    try{
        res.cookie("token",null,{
            expires:new Date(Date.now()),
        });
        res.send("logged out successfully");
    }catch(err){
        res.status(400).send(err);
    }
});

connectdb().then(()=>{
    console.log("Database is connected");
    app.listen(port,()=>{
        console.log(`Server listening on ${port}`);
    });
}).catch(err=>{
    console.log("DataBase is not connected");
});


