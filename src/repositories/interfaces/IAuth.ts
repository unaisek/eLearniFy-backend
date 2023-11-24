import { Iuser } from "../../models/User";

export interface IAuthRepository {
    createUser(userDetails: Partial<Iuser>): Promise<Iuser | null>;
    findUserByEmail(email: string): Promise<Iuser | null>;
    updateOtp(userId: string, otp: string): Promise<void>;
    findById(userId: string): Promise<Iuser | null>;
    updateVerifyStatus(userId: string, value: boolean): Promise<void>;

}