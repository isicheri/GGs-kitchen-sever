import { HttpError } from "..";
import { ErrorCode } from "../errcodes/errorcode";


export class UnproccessableEntity extends HttpError {
    constructor(message:string,error:any) {
          super("Validation Error",message,ErrorCode.VALIDATION_ERROR,402,false,error);
      }
}