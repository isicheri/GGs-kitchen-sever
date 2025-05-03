import { Request,Response,NextFunction } from "express";
import {verify} from "jsonwebtoken";
import { BadRequest } from "../utils/Errors/badRequestError/badRequest";
import { JWT_SECRET } from "../utils/secrets";
import { IUserJwt } from "../modules/user/Dto/uset.dto";
import { extractToken } from "../utils/index.utils";


const authMiddleware = (req:Request,res:Response,next:NextFunction) => {
    let token = extractToken(req);
    if(!token) {
        throw new BadRequest("not authorised",null);
    }
 try {
    let userPayload = verify(token,JWT_SECRET as string) as IUserJwt; 
    req.user = userPayload;
 } catch (error) {
    throw new BadRequest("Not authorised",error)
 }   
}
export default authMiddleware;