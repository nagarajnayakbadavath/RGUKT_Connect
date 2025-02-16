const express=require('express');
const connectdb=require('./database');
const app=express();
const port=3000;

app.get("/",(req,res)=>{
    res.send("Hello World!");
});

connectdb().then(()=>{
    console.log("Database is connected");
    app.listen(port,()=>{
        console.log(`Server listening on ${port}`);
    });
}).catch(err=>{
    console.log("DataBase is not connected");
});


