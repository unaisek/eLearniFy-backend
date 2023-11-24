import User, {Iuser} from "../models/User"; 
import { IAuthRepository } from "./interfaces/IAuth";

export default class AuthRepository implements IAuthRepository{

    async createUser(userDetails: Partial<Iuser>): Promise<Iuser | null> {
        return await User.create(userDetails);
    }

    async  findUserByEmail(email: string): Promise<Iuser | null> {
        return await User.findOne({email}).exec();
    }

    async updateOtp(userId: string, otp: string): Promise<void>{
        await User.updateOne({_id:userId},{otp})
    }

    async findById(userId: string): Promise<Iuser | null> {
        return await User.findById(userId)
    }

    async updateVerifyStatus(userId: string, value: boolean): Promise <void> {
         await User.updateOne({ _id: userId }, { $set: { is_verified: value, otp: '' } })
    }

}