import { Iuser } from "../../models/User";
import { IOtp } from "../../models/otpModel";

export interface IAuthRepository {
    createUser(userDetails: Partial<Iuser>): Promise<Iuser | null>;
    findUserByEmail(email: string): Promise<Iuser | null>;
    // updateOtp(userId: string, otp: string): Promise<void>;
    findById(userId: string): Promise<Iuser | null>;
    updateVerifyStatus(email: string, ): Promise<void>;
    findAdminByEmail(email:string):Promise<Iuser | null>;

}