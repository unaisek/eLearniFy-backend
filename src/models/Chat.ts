import mongoose, { Model, Document, Schema, model } from "mongoose";

export interface IChat extends Document{
    // id?:string;
    courseId?:string;
    messages?:IMessage[]
}

export interface IMessage {
    userName? : string;
    senderId?: string;
    message?: string;
    createdAt?: Date;
}

const chatSchema = new Schema<IChat>({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required: true       
    },
    messages:[
        {
            userName:{
                type: String,
                // required: true
            },
            senderId:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'User',
                required: true
            },
            message:{
                type: String,
                required: true
            },
            createdAt:{
                type: Date,
                default: Date.now
            },
        }
    ]
})

export default model<IChat>("Chat",chatSchema);
