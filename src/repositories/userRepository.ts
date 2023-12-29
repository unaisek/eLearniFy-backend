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
            throw Error
        }
    }

    async unBlockUser(id: string): Promise<void> {
        try {
            await User.updateOne({_id: id}, { $set: { is_blocked: false }})
        } catch (error) {
            throw Error
        }
    }

    async findUserById(userId: string): Promise<Iuser | null> {
        try {
            return await User.findById(userId)
            
        } catch (error) {

            return null
        }
        
    }

    async updateProfileImage(userId: string, profileImage: string): Promise<Iuser | null> {

        try {
            const updatedUser = await User.findByIdAndUpdate(
              { _id: userId }, 
              { $set: { profileImage } }, 
              { new: true } 
            );

            return updatedUser

            
        } catch (error) {
            throw error
        }
        
    }

    async enrollCourse(userId: string, courseId: string): Promise<void> {
        try {

            await User.findOneAndUpdate(
                { _id : userId },
                { $push: { courses: courseId } }
            )
            
        } catch (error) {
            throw error
        }
    }

}