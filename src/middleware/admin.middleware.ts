import { NextFunction, Request,Response } from "express";

const adminMiddleware = (req:Request,res:Response,next:NextFunction) => {
   if(req.user.userType !== "ADMIN") {
    return res.redirect("/auth/login");
   }
   next();
};

export default adminMiddleware;