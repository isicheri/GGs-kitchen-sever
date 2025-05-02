import { HttpError } from "..";
import { ErrorCode } from "../errcodes/errorcode";


export class BadRequest extends HttpError {
    constructor(message:string,error:any) {
        super("Bad Request Error",message,ErrorCode.BAD_REQUEST,400,false,error);
    }
}