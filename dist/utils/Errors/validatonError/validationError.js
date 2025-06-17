"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnproccessableEntity = void 0;
const __1 = require("..");
const errorcode_1 = require("../errcodes/errorcode");
class UnproccessableEntity extends __1.HttpError {
    constructor(message, error) {
        super("Validation Error", message, errorcode_1.ErrorCode.VALIDATION_ERROR, 402, false, error);
    }
}
exports.UnproccessableEntity = UnproccessableEntity;
