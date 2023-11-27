import { Iuser } from "../models/User";
import UserRepository from "../repositories/userRepository";
import { IUserService } from "./interfaces/IUserService";

export default class UserService implements IUserService{

    private _userRepository:UserRepository;

    constructor(){
        this._userRepository = new UserRepository()
    }

    async  getAllUsers(): Promise<Iuser[]> {
        try {

            return await this._userRepository.getAllUsers();
            
        } catch (error) {
            throw Error
        }
    }

    async blockUser(id:string):Promise<void>{
        try {
            await this._userRepository.blockUser(id);
            
        } catch (error) {
            throw Error
        }
    }

    async  unBlockUser(id: string): Promise<void> {
        try {
            await this._userRepository.unBlockUser(id)
        } catch (error) {
            throw Error
        }
    }

}