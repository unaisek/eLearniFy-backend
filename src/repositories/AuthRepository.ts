import User, {Iuser} from "../models/User"; 

interface IAuthRepository{
    createUser(userDetails: Partial<Iuser>):Promise<Iuser | null>;
    findUserByEmail(email:string):Promise<Iuser | null>;
    updateOtp(userId: string ,otp: string): Promise<void>;

}

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

}