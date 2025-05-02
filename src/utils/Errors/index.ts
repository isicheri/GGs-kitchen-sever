import { ErrorCode } from "./errcodes/errorcode";


export class HttpError implements Error {
    name: string;
    message: string;
    errorCode: ErrorCode;
    statusCode: number;
    success: boolean;
    error: any;
    constructor(name:string,message:string,errorCode:ErrorCode,statusCode:number,success:boolean,error:any) {
        this.name = name;
        this.message = message;
        this.error = error;
        this.statusCode = statusCode;
        this.success = success
        this.errorCode = errorCode;
        console.log(Error.captureStackTrace(this))
    }
    
}