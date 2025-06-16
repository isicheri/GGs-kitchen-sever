import { Request,Response,NextFunction } from "express";
import {verify} from "jsonwebtoken";
import { JWT_SECRET } from "../utils/secrets";
import { IUserJwt } from "../modules/user/Dto/uset.dto";
import { extractToken } from "../utils/index.utils";

const authMiddleware = (req:Request,res:Response,next:NextFunction) => {
    let token = extractToken(req);
    if(!token) {
  return res.redirect("/auth/login");
    }
 try {
    let userPayload = verify(token,JWT_SECRET as string) as IUserJwt; 
    req.user = userPayload;
    next()
 } catch (error) {
   return res.redirect("/auth/login");
 }   
}
export default authMiddleware;