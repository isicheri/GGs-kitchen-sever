"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = void 0;
const __1 = require("..");
const errorcode_1 = require("../errcodes/errorcode");
class InternalError extends __1.HttpError {
    constructor(message, error) {
        super("internal Error", message, errorcode_1.ErrorCode.SERVER_ERROR, 500, false, error);
    }
}
exports.InternalError = InternalError;
