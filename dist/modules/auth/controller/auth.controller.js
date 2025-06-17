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
exports.renderLogin = exports.logout = exports.login = exports.Register = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_validaton_1 = require("../validation/auth.validaton");
const badRequest_1 = require("../../../utils/Errors/badRequestError/badRequest");
const user_service_1 = require("../../user/service/user.service");
const secrets_1 = require("../../../utils/secrets");
const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = auth_validaton_1.CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new badRequest_1.BadRequest(parsedData.error.message, parsedData.error);
    }
    const findUser = yield (0, user_service_1.getUser)({ username: parsedData.data.username });
    if (findUser) {
        throw new badRequest_1.BadRequest("user name already exist", null);
    }
    const user = yield (0, user_service_1.createUser)(parsedData.data);
    res.status(201).json({
        message: "user created successfully",
        success: true,
        data: {
            user: { username: user === null || user === void 0 ? void 0 : user.username, type: user === null || user === void 0 ? void 0 : user.userType }
        }
    });
});
exports.Register = Register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("loginning in...");
        const parsedData = auth_validaton_1.GetUserSchema.safeParse(req.body);
        if (!parsedData.success) {
            req.flash("error", "Invalid form input.");
            return res.redirect("/auth/login");
        }
        const findUser = yield (0, user_service_1.getUser)({ username: parsedData.data.username });
        if (!findUser) {
            req.flash("error", "Username does not exist.");
            return res.redirect("/auth/login");
        }
        const validPassword = checkPassword(parsedData.data.password)(findUser.password);
        if (!validPassword) {
            req.flash("error", "Password incorrect.");
            return res.redirect("/auth/login");
        }
        const jwtPayload = { id: findUser.id, username: findUser.username, userType: findUser.userType };
        const accessToken = (0, jsonwebtoken_1.sign)(jwtPayload, secrets_1.JWT_SECRET, { expiresIn: "1hr" });
        res.cookie("jwt", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: secrets_1.EVIRONMENT === "production",
            maxAge: 60 * 60 * 1000
        });
        res.redirect("/user/dashboard");
    }
    catch (error) {
        req.flash("error", "Something went wrong. Try again.");
        res.redirect("/auth/login");
    }
});
exports.login = login;
const checkPassword = (password) => {
    return (hashedPasswod) => {
        let decryptedPasswod = bcrypt_1.default.compareSync(password, hashedPasswod);
        return decryptedPasswod;
    };
};
const logout = (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/auth/login");
};
exports.logout = logout;
const renderLogin = (req, res) => {
    res.render("login");
};
exports.renderLogin = renderLogin;
