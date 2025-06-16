import { Request,Response,NextFunction } from "express";

export const extractToken = (req:Request):string | null => {
    const token = req.cookies?.jwt;
    return token || null;
} 

export const stopCache = (req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
}