import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'

const app = express();

dotenv.config();




//mongoose connection


mongoose
     .connect(process.env.MONGO)
     .then(() => {
        console.log('Connected to MongoDB');
     })
     .then((err) => {
        console.log(err);
     });




     app.listen(3000, () => {
        console.log('Server is running on port 3000');
     }
    );


     app.use(express.json());
     app.use(cookieParser());

// middleware to handle error globally

// app.use((err,req,res,next)=>{
//    const statusCode = err.statusCode || 500;
//    const message = err.message || 'Internal server error';
//    return res.status(statusCode).json({
//       success:false,
//       statusCode,
//       message,
//    })
// })