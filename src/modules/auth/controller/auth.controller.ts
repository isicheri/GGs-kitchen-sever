import { NextFunction, Request, Response } from "express";
import {sign} from "jsonwebtoken"
import bcrypt from "bcrypt";
import { CreateUserSchema, GetUserSchema } from "../validation/auth.validaton";
import { BadRequest } from "../../../utils/Errors/badRequestError/badRequest";
import { createUser,getUser} from "../../user/service/user.service";
import { IUserJwt } from "../../user/Dto/uset.dto";
import { EVIRONMENT, JWT_SECRET } from "../../../utils/secrets";

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
    try {
        console.log("loginning in...")
          const parsedData = GetUserSchema.safeParse(req.body);
    if(!parsedData.success) {
        req.flash("error", "Invalid form input.");
      return res.redirect("/auth/login");
    }
    const findUser = await getUser({username: parsedData.data.username})
    if(!findUser) {
        req.flash("error", "Username does not exist.");
      return res.redirect("/auth/login")
    }
    const validPassword = checkPassword(parsedData.data.password)(findUser.password);
    if(!validPassword) {
     req.flash("error", "Password incorrect.");
      return res.redirect("/auth/login");
    }
    const jwtPayload:IUserJwt = {id: findUser.id,username:findUser.username,userType: findUser.userType}; 
    const accessToken = sign(jwtPayload,JWT_SECRET as string,{expiresIn: "1hr"})
    
    res.cookie("jwt",accessToken,{
        httpOnly: true,
        sameSite: "lax",
        secure: EVIRONMENT === "production",
        maxAge: 60 * 60 * 1000
    })

    res.redirect("/user/dashboard")
    } catch (error) {
       req.flash("error", "Something went wrong. Try again.");
    res.redirect("/auth/login");   
    }
}

const checkPassword = (password:string) => {
    return (hashedPasswod:string):boolean => {
   let decryptedPasswod = bcrypt.compareSync(password,hashedPasswod)
    return decryptedPasswod
    }
}

export const logout = (req: Request, res: Response) => {
  res.clearCookie("jwt");
  res.redirect("/auth/login");
};

export const renderLogin = (req: Request, res: Response) => {
  res.render("login");
};