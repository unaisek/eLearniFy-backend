import User, {Iuser} from "../models/User";
import AuthRepository from "../repositories/AuthRepository"

export  default class AuthService{
    private _authRepository: AuthRepository;

    constructor(){
        this._authRepository = new AuthRepository;
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

    async updateOtp(userId: string, otp: string): Promise<void> {
        try {
            return await this._authRepository.updateOtp(userId, otp);
        } catch (error) {
            throw error;
        }
    }

    async findById(userId: string): Promise <Iuser | null>{
        try {
            return await this._authRepository.findById(userId);            
        } catch (error) {
            throw error
        }
    }

    async updateVerifyStatus(userId: string, value: boolean): Promise<void>{
        try {
            await this._authRepository.updateVerifyStatus(userId, value)            
        } catch (error) {
            throw error
        }
    }
}