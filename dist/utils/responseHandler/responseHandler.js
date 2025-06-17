"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = void 0;
const Errors_1 = require("../Errors");
const zod_1 = require("zod");
const internalError_1 = require("../Errors/internalError/internalError");
const validationError_1 = require("../Errors/validatonError/validationError");
const responseHandler = (method) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield method(req, res, next);
        }
        catch (error) {
            let exceptions;
            if (error instanceof Errors_1.HttpError) {
                exceptions = error;
            }
            else {
                if (error instanceof zod_1.ZodError) {
                    exceptions = new validationError_1.UnproccessableEntity("input validation error", error);
                }
                else {
                    exceptions = new internalError_1.InternalError("something went wrong!", error);
                }
            }
            next(exceptions);
        }
    });
};
exports.responseHandler = responseHandler;
