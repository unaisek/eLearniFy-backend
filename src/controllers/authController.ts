import { NextFunction, Request, Response } from "express";
import bcypt from 'bcrypt';
import AuthService from "../services/AuthService";
import { sendMail } from "../utils/mail";
import { log } from "console";

export default class AuthController{
    private authService: AuthService
    constructor(){
        this.authService = new AuthService;
    }

    async postRegister(req:Request, res: Response, next: NextFunction){
        try {
            const { name, email, role, password } = req.body;
            const existingUser = await this.authService.findUserByEmail(email);

            if(existingUser){
                return res.status(400).json({
                    message: "This email already registerd"
                })
            }

            const hashPassword = await bcypt.hash(password,10);

            const user = await this.authService.createUser({
                name,
                email,
                role,
                password: hashPassword
            })

            if(user){
                sendMail({name: user.name, email: user.email, userId:user._id})
                return res.status(200).json(user)
            } else {
                return res.status(400).json({
                    message: "Can't Registered, some thing went wrong"
                })
            }
            
        } catch (error) {
            next(error)
        }
    }

    async otpVerification(req:Request, res:Response, next: NextFunction){
        try {

            const otp = (req.body.otp).toString();
            const id = (req.body.id).toString() ;
            console.log(id,"id");
            console.log(otp,"otp");
            
            

            const userData = await this.authService.findById(id);

            if(!userData){
                return res.status(400).json({
                    message:"User not found"
                })
            }

            if(userData.otp === otp){
                await this.authService.updateVerifyStatus(userData._id, true);
                return res.status(200).json({
                    message: "Success"
                })
            }
        } catch (error) {
            throw error;
            next(error);
        }
    }


}
