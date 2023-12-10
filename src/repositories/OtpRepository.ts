import otpModel, { IOtp } from "../models/otpModel";
import { IOtpRepository } from "./interfaces/IOtpRepository";

export default class OtpRepository implements IOtpRepository{
    async  createOtp(otpData: Partial<IOtp>): Promise<IOtp | null> {
        try {
            return await otpModel.create(otpData);
            
        } catch (error) {
            return null
        }
    }

    async findOtp(email: string): Promise<IOtp | null> {
        try {

            return await otpModel.findOne({email:email})
            
        } catch (error) {
            return null
        }
    }
}