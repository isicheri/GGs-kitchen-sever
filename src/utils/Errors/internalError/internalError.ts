import { HttpError } from "..";
import { ErrorCode } from "../errcodes/errorcode";


export class InternalError extends HttpError {
   constructor(message:string,error:any) {
       super("internal Error",message,ErrorCode.SERVER_ERROR,500,false,error);
   }
}