import { NextFunction, Request, Response } from "express";
import { ApiError } from "models/api/api_error";
import { IDtoUserSettings } from "models/mongo/user_settings";
import { IDtoUser } from "models/mongo/users";
import { createNewUserSettings, deleteUserSettingsFromDb, getUserSettingsFromDb, parseUserSettings, updateExistingUserSettings } from "routes/users/services";

export const getUserSettings = async (req: Request, res: Response, next: NextFunction) => {
    return getUserSettingsFromDb((req.user as IDtoUser).sub)
        .then(userSettings => handleGetUserSettings(userSettings, res, next))
        .catch((err) => next(new ApiError('Error while getting user settings', err, 500)));
}

const handleGetUserSettings = async (userSettings: IDtoUserSettings | null, res: Response, next: NextFunction) => {
    if (userSettings) return res.status(200).json(await parseUserSettings(userSettings));
    return next(new ApiError("User Settings not found", undefined, 404));
}

export const patchUserSettings = async (req: Request, res: Response, next: NextFunction) => {
    const sub = (req.user as IDtoUser).sub;
    return getUserSettingsFromDb(sub)
        .then(userSettings => userSettings ?
            updateExistingUserSettings(req, res, next, userSettings) :
            next(new ApiError("Settings for user don't exist", undefined, 404))
        )
}

export const postUserSettings = async (req: Request, res: Response, next: NextFunction) => {
    const sub = (req.user as IDtoUser).sub;
    return getUserSettingsFromDb(sub)
        .then(userSettings => userSettings ?
            next(new ApiError("Settings for user already exist", undefined, 419)) :
            createNewUserSettings(req, res, next)
        )
}

export const deleteUserSettings = async (req: Request, res: Response, next: NextFunction) => {
    return deleteUserSettingsFromDb((req.user as IDtoUser).sub)
        .then(result => handleDeleteUserSettings(result.deletedCount, res, next))
        .catch((err) => next(new ApiError('Error while getting user settings', err, 500)));
}

const handleDeleteUserSettings = async (deleteCount: number, res: Response, next: NextFunction) => {
    if (deleteCount == 1) {
        return res.status(204);
    }
    return next(new ApiError("User Settings not found", undefined, 404));
}