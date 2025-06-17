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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getAllUsers = exports.getUser = exports.createUser = void 0;
const bcrypt_1 = require("bcrypt");
const prismaClent_1 = __importDefault(require("../../../utils/prismaClient/prismaClent"));
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = (0, bcrypt_1.hashSync)(data.password, (0, bcrypt_1.genSaltSync)(14));
    const user = yield prismaClent_1.default.user.create({
        data: {
            username: data.username,
            password: hashedPassword
        }
    });
    return user;
});
exports.createUser = createUser;
const getUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = prismaClent_1.default.user.findFirst({ where: { username: data.username } });
    return user;
});
exports.getUser = getUser;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield prismaClent_1.default.user.findMany({ select: { id: true, username: true, userType: true }, where: { userType: "SELLER" } });
    return allUsers;
});
exports.getAllUsers = getAllUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaClent_1.default.user.findFirst({ where: { id: id } });
    return user;
});
exports.getUserById = getUserById;
