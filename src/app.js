const express=require('express');
const connectdb=require('./config/database');
require('dotenv').config();
const port=process.env.PORT;
const bcrypt=require('bcrypt');
const User=require('./models/user');
const app=express();
app.use(express.json());
const jwt=require('jsonwebtoken');
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const cors=require('cors');

app.use(cors({
    origin: 'https://rguktconnect.netlify.app', // Allow frontend origin
    credentials: true, // Allow sending cookies & auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow required headers
}));

// Trust proxies for secure cookies
app.set('trust proxy', 1);

const authRouter=require('./routers/auth');
const profileRouter=require('./routers/profile');
const requestRouter=require('./routers/request');

app.use("/",profileRouter);
app.use("/",authRouter);
app.use("/",requestRouter);


connectdb().then(()=>{
    console.log("Database is connected");
    app.listen(port,()=>{
        console.log(`Server listening on ${port}`);
    });
}).catch(err=>{
    console.log("DataBase is not connected");
});


