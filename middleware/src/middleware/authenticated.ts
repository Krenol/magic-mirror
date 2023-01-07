import { NextFunction, Request, Response } from "express";

export const checkAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) { return next() }
    res.status(403).json({ error: "User not authenticated" })
}