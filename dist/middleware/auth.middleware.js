"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const secrets_1 = require("../utils/secrets");
const index_utils_1 = require("../utils/index.utils");
const authMiddleware = (req, res, next) => {
    let token = (0, index_utils_1.extractToken)(req);
    if (!token) {
        return res.redirect("/auth/login");
    }
    try {
        let userPayload = (0, jsonwebtoken_1.verify)(token, secrets_1.JWT_SECRET);
        req.user = userPayload;
        next();
    }
    catch (error) {
        return res.redirect("/auth/login");
    }
};
exports.default = authMiddleware;
