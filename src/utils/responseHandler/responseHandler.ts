import { NextFunction, Request, Response } from "express";
import { HttpError } from "../Errors";
import { ZodError } from "zod";
import { InternalError } from "../Errors/internalError/internalError";
import { UnproccessableEntity } from "../Errors/validatonError/validationError";


export const responseHandler = (method:Function) => {
return async(req:Request,res:Response,next:NextFunction) => {
    try {
        await method(req,res,next);
    } catch (error) {
        let exceptions:HttpError;
            if(error instanceof HttpError) {
             exceptions = error;
            }else {
                if(error instanceof ZodError) {
               exceptions = new UnproccessableEntity("input validation error",error)
                }else {
                 exceptions = new InternalError("something went wrong!",error);
                }
            }
            next(exceptions);
    }
}
}