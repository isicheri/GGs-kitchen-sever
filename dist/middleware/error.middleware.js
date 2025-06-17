"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = (err, req, res, next) => {
    const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
    res.status(statusCode).json({
        name: err.name,
        message: err.message,
        errCode: err.errorCode,
        statusCode: err.statusCode,
        error: err.error
    });
};
exports.default = errorMiddleware;
