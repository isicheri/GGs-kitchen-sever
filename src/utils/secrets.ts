import dotenv from "dotenv";

dotenv.config();
export const port =  process.env.PORT;
export const JWT_SECRET = process.env.JWT_SEC;
export const EVIRONMENT = process.env.NODE_ENVIRONMENT;
export const SESSIONSEC = process.env.SESSION_SECRET;