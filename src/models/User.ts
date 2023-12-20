import mongoose, { Document, Schema, model } from "mongoose";

export interface Iuser extends Document{
    name: string;
    email: string;
    role: string;
    password: string;
    is_verified: boolean;
    is_admin: boolean;
    is_blocked: boolean;
    token: string;
    courses:string[];
    profileImage:string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<Iuser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    is_verified: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
    is_admin: { type: Boolean, default: false },
    token: { type: String, default: "" },
    courses: [
      {
        type: mongoose.Types.ObjectId,
        ref: "course",
      },
    ],
    profileImage:{ type:String }
  },
  { timestamps: true }
);

export default model<Iuser>('User', userSchema);