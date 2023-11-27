import User, { Iuser } from "../models/User";
import { IUserRepository } from "./interfaces/IUserReopsitory";

export default class UserRepository implements IUserRepository{

    async  getAllUsers(): Promise<Iuser[]> {
        try {
            
            return await User.find({is_admin:false}).exec()
        } catch (error) {
            return []
        }
    }

    async blockUser(id:string): Promise<void>{
        try {
            await User.updateOne({_id:id},{$set: { is_blocked: true }});            
        } catch (error) {
            
        }
    }

    async unBlockUser(id: string): Promise<void> {
        try {
            await User.updateOne({_id: id}, { $set: { is_blocked: false }})
        } catch (error) {
            
        }
    }

}