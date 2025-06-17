"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../../generated/prisma");
const prismaClient = new prisma_1.PrismaClient({
    log: ["query", "error", "info", "warn"]
});
exports.default = prismaClient;
