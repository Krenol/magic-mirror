import { NextFunction, Request, Response } from "express";
import { ApiError } from "models/api/api_error";
import { LOGGER } from "services/loggers";
import { getUserInfo } from "routes/auth/services";
import { IDtoUser } from "models/mongo/users";

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    LOGGER.info(`User ${(req.user as IDtoUser).sub ?? 'unknown'} is signing out`);
    return _logout(req, res, next)
        .catch(err => new ApiError('Error while signing out', err, 500));
}

const _logout = async (req: Request, res: Response, next: NextFunction) => {
    return req.session.destroy((err: any) => {
        if (err) {
            LOGGER.warn(`Error while signing out user ${(req.user as IDtoUser).sub ?? 'unknown'}: <${err}>`);
            return next(new ApiError('Error while signing out', err, 500));
        }
        LOGGER.info(`User ${(req.user as IDtoUser).sub ?? 'unknown'} signed out`);
        return res.status(200).json({ success: true });
    });
}

export const authCheck = async (req: Request, res: Response, next: NextFunction) => {
    return getUserInfo(req.user as IDtoUser)
        .then(() => res.status(200).json({ authenticated: true }))
        .catch((err) => { next(new ApiError('Unauthenticated request', err, 401)) })
}