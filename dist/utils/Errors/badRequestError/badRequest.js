"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequest = void 0;
const __1 = require("..");
const errorcode_1 = require("../errcodes/errorcode");
class BadRequest extends __1.HttpError {
    constructor(message, error) {
        super("Bad Request Error", message, errorcode_1.ErrorCode.BAD_REQUEST, 400, false, error);
    }
}
exports.BadRequest = BadRequest;
