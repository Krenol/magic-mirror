import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../models/api_error";
import { User } from "../../models/user";
import { postTokenInfo } from "../../services/auth/check";

export const logout = (req: Request, res: Response) => {
    req.session.destroy(() => req.logout(() => { res.status(200).json({ success: true }) }));
}
export const authCheck = async (req: Request, res: Response, next: NextFunction) => {
    return postTokenInfo(req.user as User)
        .then(() => res.json({ authenticated: true }).status(200))
        .catch((err) => { next(new ApiError('Unauthenticated request', err, 403)) })
}