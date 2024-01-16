import jwt from 'jsonwebtoken';
import { Iuser } from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

export function generateAuthToken(user:Iuser):string{
    const token = jwt.sign({
        _id:user._id,
        // role: user.role
    },process.env.JWT_SECRET as string);

    return token;
}
