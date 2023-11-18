import mongoose from "mongoose";
import app from "./app";
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://127.0.0.1:27017/elearnify").then(()=>{
    console.log("Database connected..");
    
});

app.listen(3000,()=>{
    console.log('Server connected successfully...');
    
})