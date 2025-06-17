"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSIONSEC = exports.EVIRONMENT = exports.JWT_SECRET = exports.port = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.port = process.env.PORT;
exports.JWT_SECRET = process.env.JWT_SEC;
exports.EVIRONMENT = process.env.NODE_ENVIRONMENT;
exports.SESSIONSEC = process.env.SESSION_SECRET;
