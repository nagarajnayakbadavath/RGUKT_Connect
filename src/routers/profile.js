const express=require('express');
const userAuth=require('../middlewares/auth');
const profileRouter=express.Router();
const User=require('../models/user');
const connectionRequest=require('../models/connectionRequestSchema');
profileRouter.use(express.json());


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
        const user=req.user._id;
        const loggedInprofile=await User.findById(user);
        res.send(loggedInprofile);
    }catch(err){
        res.status(400).send("Error :"+err.message);
    }
});

profileRouter.get("/Allprofiles",userAuth,async(req,res)=>{
    try{
        const myId=req.user._id;   //logged person's id
        // console.log("My id is ",myId);
        const connectedProfile=await connectionRequest.find({$or:[{receiverId:myId},{senderId:myId}]});     //receiverId
        if(connectedProfile.length==0){
            //Here in this field comes only when the loggedIn user doesn't send or received any connection request
            //so in this case we just remove the myId
            const remainingId=await User.find({_id:{$nin:[myId]}});
            return res.send(remainingId);
        }
        // //from connectedProfile i need senderId 
        // console.log("This are connected profiles",connectedProfile);
        const requestedIds=connectedProfile.map(profile=>
            profile.senderId.toString()!==myId.toString()?profile.senderId:profile.receiverId);

        // console.log("filtered id's to exclude",requestedIds);

        const excludeIds=[myId,...requestedIds];
        const remainingProfiles=await User.find({_id:{$nin:excludeIds}});
        if(!remainingProfiles){
            return res.status(400).send('No New Profiles were found in the Database');
        }
        res.send(remainingProfiles);
    }catch(err){
        res.status(400).send(err.message);
    }
});

profileRouter.put("/profile/edit",userAuth,async(req,res)=>{
    try{
        const {firstName,lastName,about,photourl,skills}=req.body;
        if(!firstName || !lastName || !about || !photourl || !skills){
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

profileRouter.patch(".profile/forgotpassword",userAuth,async(req,res)=>{
    try{
        
    }catch(err){
        res.status(400).send(err.message);
    }
});

profileRouter.get("/getAcceptedProfiles",userAuth,async(req,res)=>{
    try{
        const myId=req.user._id;
        console.log(myId);
        // $and:[{receiverId:myId},{status:'accepted'}]
        const acceptedProfiles=await connectionRequest.find({
            $and: [
                {
                  $or: [
                    { receiverId: myId },
                    { senderId: myId }
                  ]
                },
                { status: "accepted" }
              ]
        });
        // res.send(acceptedProfiles);
        console.log(acceptedProfiles);
        const friendsId=acceptedProfiles.map(request=>{
            if(request.senderId.toString()===myId.toString()){
                return request.receiverId;
            }else{
                return request.senderId;
            }
        });

        const userProfiles=await User.find({_id:{$in:friendsId}});
        res.send(userProfiles);
    }catch(err){
        console.log(err.message);
    }
})

module.exports=profileRouter;