import mongoose from "mongoose";
// import app from "./app";
import dotenv from 'dotenv';
import { httpServer } from "./app";
dotenv.config();

const dbUrl:string = process.env.DB_URL ||" ";
const port: number = parseInt(process.env.PORT || "3000");


mongoose.connect(dbUrl).then(()=>{  
    console.log("Database connected..");
    
});

httpServer.listen(port,()=>{
    console.log('Server connected successfully...');   
})