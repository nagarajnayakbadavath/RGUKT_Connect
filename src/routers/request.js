const express=require('express');
requestRouter=express.Router();
const userAuth=require('../middlewares/auth');
const User=require('../models/user');
const connectionRequest= require('../models/connectionRequestSchema');


requestRouter.post("/request/send/connect/:userId",userAuth,async(req,res)=>{
    try{
        const userId=req.params.userId;
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).send("user is not found by userId");
        }
        const senderId=req.user._id;
        const findAlreadySent=await connectionRequest.findOne({
            senderId,
            receiverId:userId,
        });
        if(findAlreadySent){
            return res.status(400).send("already you have sent the request");
        }
        const firstName=req.user.firstName;
        const lastName=req.user.lastName;

        if(senderId===userId){
            return res.status(400).send("you cannot send a connection Request yourself");
        }
        //create a new connectionRequest
        const newRequest=new connectionRequest({
            senderId:senderId,
            receiverId:userId,
            firstName:firstName,
            lastName:lastName,
            message:req.body.message || '',
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
        const myId=req.user._id;
        const {senderId}=req.params;
        console.log(senderId);
        const request=await connectionRequest.findOne({receiverId:myId,
            senderId,
            status:'pending'});
        if(!request){
            return res.status(400).send("your are not requested or already gave the status");
        }
        const updatedRequest=await connectionRequest.findOneAndUpdate(
            {_id:request._id},
            {status:'accepted'},
            {new:true}
        );
        res.send(updatedRequest);
    }catch(err){
        res.status(400).send(err.message);
    }
});


requestRouter.put("/request/:senderId/reject",userAuth,async(req,res)=>{
    try{
        const myId=req.user._id;
        const {senderId}=req.params;
        console.log(senderId);
        const request=await connectionRequest.findOne({receiverId:myId,
            senderId,
            status:'pending'});
        if(!request){
            return res.status(400).send("your are not requested or already gave the status");
        }
        const updatedRequest=await connectionRequest.findOneAndUpdate(
            {_id:request._id},
            {status:'rejected'},
            {new:true}
        );
        res.send(updatedRequest);
    }catch(err){
        res.status(400).send(err.message);
    }
});

module.exports=requestRouter;