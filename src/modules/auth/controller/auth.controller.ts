import { NextFunction, Request, Response } from "express";
import {sign} from "jsonwebtoken"
import bcrypt from "bcrypt";
import { CreateUserSchema, GetUserSchema } from "../validation/auth.validaton";
import { BadRequest } from "../../../utils/Errors/badRequestError/badRequest";
import { createUser,getUser} from "../../user/service/user.service";
import { IUserJwt } from "../../user/Dto/uset.dto";
import { JWT_SECRET } from "../../../utils/secrets";

export const Register = async(req:Request,res:Response,next:NextFunction) => {
const parsedData = CreateUserSchema.safeParse(req.body);
if(!parsedData.success) {
    throw new BadRequest(parsedData.error.message,parsedData.error)
}
const findUser = await getUser({username: parsedData.data.username})
if(findUser) {
    throw new BadRequest("user name already exist",null);
}
const user = await createUser(parsedData.data);
res.status(201).json({
message: "user created successfully",
success: true,
data: {
    user: {username: user?.username,type:user?.userType}
}
})
}


export const login = async (req:Request,res:Response,next:NextFunction) => {
    const parsedData = GetUserSchema.safeParse(req.body);
    if(!parsedData.success) {
        throw new BadRequest(parsedData.error.message,parsedData.error)
    }
    const findUser = await getUser({username: parsedData.data.username})
    if(!findUser) {
        throw new BadRequest("Username does not exist",null)
    }
    const validPassword = checkPassword(parsedData.data.password)(findUser.password);
    if(!validPassword) {
     throw new BadRequest("password incorrect",null);
    }
    const jwtPayload:IUserJwt = {id: findUser.id,username:findUser.username,userType: findUser.userType}; 
    const accessToken = sign(jwtPayload,JWT_SECRET as string,{expiresIn: "1hr"})
    res.status(200).json({
        message: "use successfully logged in",
        success: true,
        data: {
            id: findUser.id,
            username: findUser.username,
            userType: findUser.userType
        },
        token: accessToken
    })
}


const checkPassword = (password:string) => {
    return (hashedPasswod:string):boolean => {
   let decryptedPasswod = bcrypt.compareSync(password,hashedPasswod)
    return decryptedPasswod
    }
}