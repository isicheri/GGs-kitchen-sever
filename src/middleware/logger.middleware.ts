import { NextFunction, Request, Response } from "express";
import chalk from "chalk";


const loggerMiddleware = (req:Request,res:Response,next:NextFunction) => {
    const method = req.method;
    const url = req.originalUrl;
    const timeStamp = new Date().toISOString();
    console.log(`${chalk.green(`request-time: ${timeStamp}`)}
                 ${chalk.yellow(`request-method: ${method}`)}
                 ${chalk.red(`request-url: localhost:8001/${url}`)}`)
next()
}


export default loggerMiddleware;