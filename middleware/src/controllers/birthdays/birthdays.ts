import { NextFunction, Request, Response } from "express";
import { CALENDAR_CONFIG } from "../../config/google";
import { ApiError } from "../../models/api_error";
import { GoogleUser } from "../../models/express_user";
import { parseRetrievedBirthdays, getBirthdayEvents } from "../../services/calendar/birthdays";
import { EventRequestParams } from "../../models/calendar";

export const allBirthdays = async (req: Request, res: Response, next: NextFunction) => {
    getBirthdayApiRequestParams(parseInt((req.query.count || CALENDAR_CONFIG.DEFAULT_EVENT_COUNT).toString()))
        .then(params => getBirthdayEvents(req.user as GoogleUser, params))
        .then(response => parseRetrievedBirthdays(response))
        .then(birthdays => res.status(200).json(birthdays))
        .catch((err) => next(new ApiError("Error while retrieving calendar events", err, 500)))
}


const getBirthdayApiRequestParams = async (maxResults: number = 1): Promise<EventRequestParams> => {
    const minTime = (new Date()).toISOString();
    return {
        maxResults,
        minTime,
        maxTime: undefined
    }
}