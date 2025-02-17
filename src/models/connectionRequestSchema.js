const mongoose=require('mongoose');

const connectionRequestSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true,
    },
    receiverId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true,
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum: ['pending', 'accepted', 'rejected'],
        default:'pending',
        required:true,
    },
    message:{ 
        type:String, 
        required:false,
      },
      sentAt:{ 
        type:Date, 
        default:Date.now, 
      }
},{timestamps:true});

module.exports=mongoose.model('connectionRequest',connectionRequestSchema);