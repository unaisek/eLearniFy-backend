import { Document, Schema, model } from 'mongoose';

export interface IOtp extends Document {
    email: string;
    otp : string;
    createdAt?:Date

}

const otpSchema = new Schema<IOtp>({
    email:{
        type:String,
        required: true
    },
    otp :{
        type: String,
        required:true,
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
})

otpSchema.index({createdAt:1},{expireAfterSeconds:120})

export default model<IOtp>('otp',otpSchema)