"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const loggerMiddleware = (req, res, next) => {
    const method = req.method;
    const url = req.originalUrl;
    const timeStamp = new Date().toISOString();
    console.log(`${chalk_1.default.green(`request-time: ${timeStamp}`)}${chalk_1.default.yellow(`request-method: ${method}`)} ${chalk_1.default.red(`request-url:localhost:4000/${url}`)}`);
    next();
};
exports.default = loggerMiddleware;
