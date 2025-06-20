import { NextFunction, Request, Response } from "express";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config()
const loggerMiddleware = (req:Request,res:Response,next:NextFunction) => {
    const method = req.method;
    const url = req.originalUrl;
    const host = req.host;
    const timeStamp = new Date().toISOString();
    console.log(`${chalk.green(`request-time: ${timeStamp}`)} ${chalk.yellow(`request-method: ${method}`)} ${chalk.red(`request-url: ${host}${url}`)}`)
   next()
}
export default loggerMiddleware;