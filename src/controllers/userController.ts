import { Request, Response, NextFunction } from "express";
import UserService from "../services/userService";

export default class UserController{
    private _userService: UserService;

    constructor() {
        this._userService = new UserService();
    }

    async getAllUsers(req: Request, res: Response, next:NextFunction){
        try {

            const userList = await this._userService.getAllUsers();
            return res.status(200).json(userList);
            
        } catch (error) {
            next(error)
        }
    }

    async blockUser(req: Request, res: Response, next:NextFunction){
        try {

            const userId = req.params.id;
            await this._userService.blockUser(userId);
            res.status(200).json({
                message:"User is Blocked"
            })
            
        } catch (error) {
            next(error)
        }
    }

    async UnBlockUser(req: Request, res: Response, next: NextFunction){
        const userId = req.params.id;
        await this._userService.unBlockUser(userId);
        res.status(200).json({
            message:"User is Unblocked"
        })
    }


    async getUserData(req:Request, res:Response, next:NextFunction){
        try {

            const userId = req.params.id;
            const userData = await this._userService.getUserData(userId);
            if(userData){
                res.status(200).json(userData)
            }
            
        } catch (error) {
            next(error)
        }
    }

    async uploadProfileImage(req:Request, res:Response, next:NextFunction){
        try {           
            const file = req.files as Express.Multer.File[];
            const { userId } = req.body;           
            const result = await this._userService.uploadProfileImage(file,userId);
            
            if(result){
                res.status(200).json(result)
            }
            
        } catch (error) {
            next(error)
        }
    }

    async getWalletData(req:Request, res:Response, next:NextFunction){
        try {
            const userId = req.params.userId;           
            const walletData = await this._userService.getWalletData(userId);            
            if(walletData){
                res.status(200).json(walletData)
            }
            
            
        } catch (error) {
            next(error)
        }
    }
}