import { Iuser } from "../../models/User";

export interface IUserRepository{
    getAllUsers():Promise <Iuser[]>;
    blockUser(id:string): Promise<void>;
    unBlockUser(id: string): Promise<void>;
}