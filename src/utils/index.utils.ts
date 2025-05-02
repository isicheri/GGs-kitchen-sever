import { Request } from "express";

export const extractToken = (req:Request):string | null => {
    const header = req.headers.authorization;
    let [type,token]  = header?.split(" ") ?? [];
    return type === "Bearer" || "Basic" ? token : null; 
} 