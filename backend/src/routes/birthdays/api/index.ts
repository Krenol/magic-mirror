import { CALENDAR_CONFIG } from "config";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "models/api/api_error";
import { EventRequestParams } from "models/api/calendar";
import { IDtoUser } from "models/mongo/users";
import { getBirthdayEvents } from "routes/birthdays/services";

export const allBirthdays = async (req: Request, res: Response, next: NextFunction) => {
    return getBirthdayApiRequestParams(parseInt((req.query.count as string ?? CALENDAR_CONFIG.DEFAULT_EVENT_COUNT).toString()))
        .then(params => getBirthdayEvents(req.user as IDtoUser, params))
        .then(birthdays => res.status(200).json(birthdays))
        .catch((err) => next(new ApiError("Error while retrieving calendar events", err, 500)))
}

const getBirthdayApiRequestParams = async (maxResults = 1): Promise<EventRequestParams> => {
    const minTime = (new Date()).toISOString();
    return {
        maxResults,
        minTime,
        maxTime: undefined
    }
}