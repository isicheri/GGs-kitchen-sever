"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopCache = exports.extractToken = void 0;
const extractToken = (req) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
    return token || null;
};
exports.extractToken = extractToken;
const stopCache = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    next();
};
exports.stopCache = stopCache;
