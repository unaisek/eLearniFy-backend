import { promises } from "dns";
import { Iuser } from "../../models/User";
import { IOtp } from "../../models/otpModel";


export interface IAuthService {
  createUser(userDetails: Partial<Iuser>): Promise<Iuser | null>;
  findUserByEmail(email: string): Promise<Iuser | null>;
  createOtp(otpData:Partial<IOtp>):Promise<IOtp| null>;
  findOtp(email:string):Promise<IOtp | null>;
  findById(id: string): Promise<Iuser | null>;
  updateVerifyStatus(email: string,): Promise<void>;

  // admin auth
  adminLogin(email:string,password:string):Promise<{token:string}>;
}