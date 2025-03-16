const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        min:[6],
        max:[12],
    },
    lastName:{
        type:String,
        required:true,
    },
    Id_no:{
        type:String,
        reqired:false,
    },
    emailId:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    year_of_study:{
        type:String,
        required:false,
    },
    skills:{
        type:[String],
        required:false,
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