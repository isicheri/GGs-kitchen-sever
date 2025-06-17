"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError {
    constructor(name, message, errorCode, statusCode, success, error) {
        this.name = name;
        this.message = message;
        this.error = error;
        this.statusCode = statusCode;
        this.success = success;
        this.errorCode = errorCode;
        console.log(Error.captureStackTrace(this));
    }
}
exports.HttpError = HttpError;
