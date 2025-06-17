"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminMiddleware = (req, res, next) => {
    if (req.user.userType !== "ADMIN") {
        return res.redirect("/auth/login");
    }
    next();
};
exports.default = adminMiddleware;
