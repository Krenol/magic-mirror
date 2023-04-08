import { NextFunction, Request, Response } from "express";
import { ApiError } from "models/api/api_error";
import { GoogleUser } from "models/api/express_user";
import { LOGGER } from "services/loggers";
import { postTokenInfo } from "routes/auth/services";

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    LOGGER.info(`User ${(JSON.stringify(req.user as GoogleUser)) || 'unknown'} signed out`);
    return _logout(req, res)
        .catch(err => LOGGER.error(err.message))
}

const _logout = async (req: Request, res: Response) => {
    LOGGER.info(`User ${(JSON.stringify(req.user as GoogleUser)) || 'unknown'} signed out`);
    return req.session.destroy(() => req.logout(() => {
        LOGGER.info(`User ${(req.user as GoogleUser) || 'unknown'} signed out`);
        return res.status(200).json({ success: true });
    }));
}

export const authCheck = async (req: Request, res: Response, next: NextFunction) => {
    return postTokenInfo(req.user as GoogleUser)
        .then(() => res.status(200).json({ authenticated: true }))
        .catch((err) => { next(new ApiError('Unauthenticated request', err, 401)) })
}