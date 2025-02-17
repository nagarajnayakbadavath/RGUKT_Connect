const mongoose=require('mongoose');


const connectdb=async()=>{
    await mongoose.connect('mongodb+srv://nagarajnayakbadavath:Naga_1136@rguktcluster.kiby8.mongodb.net/');
}

module.exports=connectdb;
