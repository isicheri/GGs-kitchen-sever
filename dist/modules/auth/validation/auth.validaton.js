"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string().max(8, "Password cannot be more than 8 characters long")
});
exports.GetUserSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string()
});
