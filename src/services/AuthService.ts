import User, {Iuser} from "../models/User";
import AuthRepository from "../repositories/AuthRepository";

export  default class AuthService{
    private authRepository: AuthRepository;

    constructor(){
        this.authRepository = new AuthRepository;
    }

    async createUser(userDetails: Partial <Iuser>):Promise<Iuser | null>{
        return await this.authRepository.createUser(userDetails);
    }

    async findUserByEmail(email: string): Promise<Iuser | null>{
        return await this.authRepository.findUserByEmail(email);
    }

    async updateOtp(userId: string, otp: string): Promise<void> {
        try {
            return await this.authRepository.updateOtp(userId, otp);
        } catch (error) {
            throw error;
        }
    }
}