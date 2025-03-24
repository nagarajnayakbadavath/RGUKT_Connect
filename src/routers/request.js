const express=require('express');
requestRouter=express.Router();
const userAuth=require('../middlewares/auth');
const User=require('../models/user');
const connectionRequest= require('../models/connectionRequestSchema');
const mongoose=require('mongoose');


requestRouter.post("/request/send/connect/:userId",userAuth,async(req,res)=>{
    try{
        const userId=req.params.userId;
        console.log(userId);   //This userId is that fellow to whom we want to send request with
        const user=await User.findById(userId);   //for checking if user already exists or not
        if(!user){
            return res.status(400).send("user is not found by userId");
        }
        const senderId=req.user._id;
        console.log(senderId);  //request senders id to check whether he/she sent request already or not
        const findAlreadySent=await connectionRequest.findOne({
            senderId,
            receiverId:userId,
        });
        if(findAlreadySent){
            return res.status(400).send("already you have sent the request");
        }
        const firstName=req.user.firstName;
        const lastName=req.user.lastName;
        const photourl=req.user.photourl;

        if(senderId===userId){
            return res.status(400).send("you cannot send a connection Request yourself");
        }
        //create a new connectionRequest
        const newRequest=new connectionRequest({
            senderId:senderId,
            receiverId:userId,
            firstName:firstName,
            lastName:lastName,
            photourl:photourl,
            // message:req.body.message || '',
            status:'pending',
        });
        newRequest.save();
        res.send(newRequest);
    }catch(err){
        res.status(400).send(err.message);
    }
});

requestRouter.get("/requests/recieved",userAuth,async(req,res)=>{
    try{
        //Here only those user can come how are authenticated by logging in through userAuth
        //Here now receiver logged in and checks the requests that he/she got
        const myId=req.user._id;
        console.log(myId);
        const users=await connectionRequest.find({receiverId:myId, status:'pending'});
        if(!users){
            return res.status(400).send("user not found here");
        }
        res.send(users);
    }catch(err){
        res.status(400).send(err.message);
    }
});

requestRouter.put("/request/:senderId/accept",userAuth,async(req,res)=>{
    try{
        const senderId=req.params.senderId;
        const acceptedProfile=await connectionRequest.findOneAndUpdate({senderId:senderId},{status:'accepted'},{new:true});
        res.send(acceptedProfile);
    }catch(err){
        res.status(400).send(err.message);
    }
});


requestRouter.put("/request/:senderId/reject",userAuth,async(req,res)=>{
    try{
        const myId=req.user._id;
        const senderId=req.params.senderId;
        const rejectedProfiles=await connectionRequest.findOneAndUpdate({senderId:senderId},{status:'rejected'},{new:true});
        res.send(rejectedProfiles);
    }catch(err){
        res.status(400).send(err.message);
    }
});

module.exports=requestRouter;