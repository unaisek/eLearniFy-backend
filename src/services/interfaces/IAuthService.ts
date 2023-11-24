import { Iuser } from "../../models/User";


export interface IAuthService {
    
    createUser(userDetails: Partial<Iuser>): Promise<Iuser | null>;

}