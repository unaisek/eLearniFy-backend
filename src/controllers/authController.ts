import { NextFunction, Request, Response } from "express";
import bcypt from 'bcrypt';
import AuthService from "../services/AuthService";
import { sendMail } from "../utils/mail";
import { log } from "console";
import { generateAuthToken, jwtVerify } from "../utils/jwt";

export default class AuthController {
  private _authService: AuthService;
  constructor() {
    this._authService = new AuthService();
  }

  async postRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, role, password } = req.body;
      const existingUser = await this._authService.findUserByEmail(email);

      if (existingUser) {
        return res.status(400).json({
          message: "This email already registerd",
        });
      }

      const hashPassword = await bcypt.hash(password, 10);

      const user = await this._authService.createUser({
        name,
        email,
        role,
        password: hashPassword,
      });

      if (user) {
        sendMail({ name: user.name, email: user.email });
        return res.status(200).json(user);
      } else {
        return res.status(400).json({
          message: "Can't Registered, some thing went wrong",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction){
    try {
        const {email}= req.body
        // const email= (req.query.email).toString();
        console.log(req.body,"resend");
        
        const userData = await this._authService.findUserByEmail(email);
        if(userData){
            sendMail({name:userData.name,email});
            return res.status(200).json(userData)
        }
        
    } catch (error) {
        next(error)
    }
  }

  async otpVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const otp = req.body.otp.toString();
      const email = req.body.email;

      const otpData = await this._authService.findOtp(email);

      if (otpData?.otp === otp) {
        await this._authService.updateVerifyStatus(email);
        return res.status(200).json({
          message: "Success",
        });
      }
    } catch (error) {
      // throw error;
      next(error);
    }
  }

  async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userData = await this._authService.findUserByEmail(email);

      if (!userData) {
        return res.status(401).json({
          message: "User is not found",
        });
      }

      if (!userData.is_verified) {
        return res.status(401).json({
          message: "User not verified",
        });
      }

      if (userData.is_blocked) {
        return res.status(401).json({
          message: "User is blocked",
        });
      }

      const passwordMatch = await bcypt.compare(password, userData.password);

      if (!passwordMatch) {
        return res.status(401).json({
          message: "password is incorrect",
        });
      }

      const token = generateAuthToken(userData);
      return res
        .status(200)
        .json({ token: token, user: userData._id, role: userData.role });
    } catch (error) {
      next(error);
    }
  }

  async userReverification(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      const userData = await this._authService.findUserByEmail(email);

      if (!userData) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      sendMail({ name: userData.name, email: userData.email });
      return res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  }

  // admin login

  async adminLoginPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const token = await this._authService.adminLogin(email, password);
      res.status(200).json(token);
    } catch (error) {
      let statusCode = 404;
      let errorMessge = "Unauthorized user";

      if ((error as Error).message == "Admin not found") {
        statusCode = 404;
        errorMessge = "Admin not found";
      } else if ((error as Error).message == "Incorrect password") {
        statusCode = 401;
        errorMessge = "Incorrect password";
      }

      res.json(statusCode).json({ message: errorMessge });
    }
  }
}
