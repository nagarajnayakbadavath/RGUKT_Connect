

const socket=require('socket.io');


const initializeSocket=(server)=>{
    const io=socket(server,{
        cors:{
            origin:"https://rguktconnect.netlify.app",
        },
    })
    
    io.on("connection",(socket)=>{
            //Handle Events
            socket.on("joinChat",({firstName,userId,targetUserId})=>{
                const roomId=[userId,targetUserId].sort().join("_");
                console.log(firstName ," is joined room id is ",roomId);
                socket.join(roomId);
            });
            socket.on("sendMessage",({firstName,userId,targetUserId,text})=>{
                const roomId=[userId,targetUserId].sort().join("_");
                console.log(`${firstName}: ${text}`);
                io.to(roomId).emit("messageReceived",{firstName,text})    
            });
            socket.on("disconnect",()=>{
            });   
    });
}

module.exports=initializeSocket;