const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    emailId:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    photourl:{
        type:String,
        required:false
    },
    gender:{
        type:String,
        required:false
    },
    about:{
        type:String,
    }
},{timestamps:true});

module.exports=mongoose.model("User",userSchema);