import { Request,Response,NextFunction } from "express"
import { HttpError } from "../utils/Errors"


const errorMiddleware = (err:HttpError,req:Request,res:Response,next:NextFunction) =>  {
    res.status(err.statusCode).json({
        name: err.name,
        message: err.message,
        errCode: err.errorCode,
        statusCode: err.statusCode,
        error: err.error 
    })
}

export default errorMiddleware;