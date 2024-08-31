import { NextFunction, Request, Response } from 'express';
import { ApiError } from 'models/api/api_error';
import { deleteUserFromDb } from 'routes/users/services/users';
import { deleteUserSettingsFromDb } from 'routes/users/services/settings';
import { LOGGER } from 'services/loggers';
import { getUserId } from 'services/headers';

export const deleteMeUser = async (req: Request, res: Response, next: NextFunction) => {
  const sub = await getUserId(req.headers);
  LOGGER.info(`Deleting user ${sub}`);
  return deleteUserSettingsFromDb(sub)
    .then(() => deleteUserFromDb(sub))
    .then((result) => handleDeleteUser(result.deletedCount, res, next))
    .catch((err) => next(new ApiError('Error while getting user settings', err, 500)));
};

const handleDeleteUser = async (deleteCount: number, res: Response, next: NextFunction) => {
  if (deleteCount == 1) {
    return res.status(204).json();
  }
  return next(new ApiError('User not found', undefined, 404));
};
