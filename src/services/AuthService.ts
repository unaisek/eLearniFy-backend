import { error } from "console";
import User, {Iuser} from "../models/User";
import AuthRepository from "../repositories/AuthRepository";
import bcrypt from 'bcrypt';
import { generateAuthToken } from "../utils/jwt";
import { IAuthService } from "./interfaces/IAuthService";
import { IOtp } from "../models/otpModel";
import OtpRepository from "../repositories/OtpRepository";

export  default class AuthService implements IAuthService{
    private _authRepository: AuthRepository;
    private _otpRpository:OtpRepository

    constructor(){
        this._authRepository = new AuthRepository;
        this._otpRpository = new OtpRepository();
    }

    async createUser(userDetails: Partial <Iuser>):Promise<Iuser | null>{
        try {
            return await this._authRepository.createUser(userDetails);           
        } catch (error) {
            throw error;
        }
    }

    async findUserByEmail(email: string): Promise<Iuser | null>{
        try {
            return await this._authRepository.findUserByEmail(email);
            
        } catch (error) {
            throw error
        }
    }

    async createOtp(otpData:Partial <IOtp>): Promise<IOtp | null> {
        try {
            return await this._otpRpository.createOtp(otpData);
            
        } catch (error) {
            throw error
        }
    }

    // async updateOtp(userId: string, otp: string): Promise<void> {
    //     try {
    //         return await this._authRepository.updateOtp(userId, otp);
    //     } catch (error) {
    //         throw error;
    //     }
    // }
       async findOtp(email: string): Promise<IOtp | null> {
            try {

                return await this._otpRpository.findOtp(email)
                
            } catch (error) {
                throw error
            }
        }

    async findById(userId: string): Promise <Iuser | null>{
        try {
            return await this._authRepository.findById(userId);            
        } catch (error) {
            throw error
        }
    }

    async updateVerifyStatus(email: string,): Promise<void>{
        try {
            await this._authRepository.updateVerifyStatus(email)            
        } catch (error) {
            throw error
        }
    }


    async adminLogin(email:string,password:string): Promise<{token:string}>{
        try {

            const adminData = await this._authRepository.findAdminByEmail(email);

            if(!adminData){
                throw new Error("Admin not found")
            } 

            const passwordMatch = await bcrypt.compare(password,adminData.password);
            if(!passwordMatch){
                throw new Error("Incorrect password")
            }

            const token = generateAuthToken(adminData);
            return {token}
            
        } catch (error) {
            throw error
        }
    }
}