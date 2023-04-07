import { NextFunction, Request, Response } from "express";
import { ApiError } from "../models/api_error";

export const checkAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) { return next() }
    return next(new ApiError("User not authenticated", new Error("User not authenticated"), 401));
}