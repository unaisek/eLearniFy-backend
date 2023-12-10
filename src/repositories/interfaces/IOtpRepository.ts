import { IOtp } from "../../models/otpModel";

export interface IOtpRepository{
    createOtp(otpData: Partial<IOtp>):Promise<IOtp | null>;
    findOtp(email:string):Promise<IOtp | null>;

}