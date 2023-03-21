import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../models/api_error";
import { GoogleUser } from "../../models/express_user";
import { postTokenInfo } from "../../services/auth/check";
import { LOGGER } from "../../services/loggers";

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    LOGGER.info(`User ${(JSON.stringify(req.user as GoogleUser)) || 'unknown'} signed out`);
    return _logout(req, res)
        .catch(err => LOGGER.error(err.message))
}

const _logout = async (req: Request, res: Response) => {
    LOGGER.info(`User ${(JSON.stringify(req.user as GoogleUser)) || 'unknown'} signed out`);
    return req.session.destroy(() => req.logout(() => {
        LOGGER.info(`User ${(req.user as GoogleUser) || 'unknown'} signed out`);
        return res.json({ success: true }).status(200)
    }));
}

export const authCheck = async (req: Request, res: Response, next: NextFunction) => {
    return postTokenInfo(req.user as GoogleUser)
        .then(() => res.json({ authenticated: true }).status(200))
        .catch((err) => { next(new ApiError('Unauthenticated request', err, 401)) })
}