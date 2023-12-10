import nodemailer from 'nodemailer';
import AuthService from '../services/AuthService';
import dotenv from 'dotenv';
import AuthRepository from '../repositories/AuthRepository';
import { type } from 'os';
import { strict } from 'assert';
import { IOtp } from '../models/otpModel';
dotenv.config();


type SendMailParams = {
    name: string,
    email: string,
}

type EmailOptions = {
    from: string,
    to: string,
    subject: string,
    html: string
}

export const sendMail = async({ name, email }: SendMailParams): Promise <void> =>{
    try {

        const otp = generateOtp();
        console.log(otp);

    
        const authService = new AuthService();
        
        await authService.createOtp({email,otp});

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth : {
                user: process.env.EMAIL,
                pass: process.env.PASS

            }
        });

        const mailOptions:EmailOptions = {
            from: process.env.EMAIL as string,
            to : email,
            subject: 'For email verification',
            html: `<p> Hi ${name} your OTP verification is <b>${otp}</b>. Enter the otp and verify account.</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email send -->",info.response);

    } catch (error) {
        throw error
    }
}


function generateOtp(): string {
    let otp = '';
    const digits ='0123456789';
    for(let i = 0; i< 4; i++){
        otp += digits[Math.floor(Math.random() * 10)]
    }
    return otp;
}

