import { NextFunction, Request, Response } from "express";
import { ApiError } from "models/api/api_error";
import { ApiDtoUserSettings } from "models/api/userSettings";
import { DtoUserSettings, IDtoUserSettings } from "models/mongo/user_settings";
import { IDtoUser } from "models/mongo/users";
import { LOGGER } from "services/loggers";

export const getUserSettingsFromDb = async (sub: string): Promise<IDtoUserSettings | null> => {
    return DtoUserSettings.findOne({ sub });
}

export const updateExistingUserSettings = async (req: Request, res: Response, next: NextFunction, userSettings: IDtoUserSettings) => {
    const payload = req.body as ApiDtoUserSettings;
    return updateUserSettingsinDb(userSettings, payload)
        .then(parseUserSettings)
        .then(u => res.status(201).json(u))
        .catch((err) => next(new ApiError('Error while updating user settings', err, 500)));
}

export const createNewUserSettings = async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as ApiDtoUserSettings;
    const sub = (req.user as IDtoUser).sub;
    createNewUserSettingsinDb(sub, payload)
        .then(parseUserSettings)
        .then(u => res.status(201).json(u))
        .catch((err) => next(new ApiError('Error while updating user settings', err, 500)));
}

export const updateUserSettingsinDb = async (userSettings: IDtoUserSettings, newUserSettings: ApiDtoUserSettings): Promise<IDtoUserSettings> => {
    userSettings.zip_code = newUserSettings.zip_code;
    userSettings.country = newUserSettings.country;
    userSettings.city = newUserSettings.city;
    return userSettings.save()
        .then(logUserSettingsUpdate);
}

export const createNewUserSettingsinDb = async (sub: string, newUserSettings: ApiDtoUserSettings): Promise<IDtoUserSettings> => {
    const userSettings = new DtoUserSettings({
        zip_code: newUserSettings.zip_code,
        country: newUserSettings.country,
        city: newUserSettings.city,
        sub
    });
    return userSettings.save()
        .then(logUserSettingsUpdate);
}

const logUserSettingsUpdate = async (userSettings: IDtoUserSettings): Promise<IDtoUserSettings> => {
    LOGGER.info(`Created/updated settings for user ${userSettings.sub}`);
    return userSettings;
}

export const parseUserSettings = async (userSettings: IDtoUserSettings): Promise<ApiDtoUserSettings> => {
    return {
        zip_code: userSettings.zip_code,
        country: userSettings.country,
        city: userSettings.city
    }
}
