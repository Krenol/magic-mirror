import { NextFunction, Request, Response } from "express";
import { ApiError } from "models/api/api_error";
import { IDtoUser } from "models/mongo/users";
import { deleteUserFromDb } from "routes/users/services/users";
import { deleteUserSettingsFromDb } from "routes/users/services/settings";
import { LOGGER } from "services/loggers";

export const deleteMeUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = (req.user as IDtoUser);
    LOGGER.info(`Deleting user ${user}`)
    return deleteUserSettingsFromDb(user.sub)
        .then(() => deleteUserFromDb(user.sub))
        .then(result => handleDeleteUser(result.deletedCount, res, next))
        .catch((err) => next(new ApiError('Error while getting user settings', err, 500)));
}

const handleDeleteUser = async (deleteCount: number, res: Response, next: NextFunction) => {
    if (deleteCount == 1) {
        return res.status(204).json();
    }
    return next(new ApiError("User not found", undefined, 404));
}