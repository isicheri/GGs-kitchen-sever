// import { PrismaClient } from "../../generated/prisma";
import {PrismaClient} from "../../../src/generated/prisma"
const prismaClient = new PrismaClient({
    log: ["query","error","info","warn"]
})
export default prismaClient;