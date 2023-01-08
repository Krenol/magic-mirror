import { NextFunction, Request, Response } from "express";
import { CALENDAR_CONFIG } from "../../config/google";
import { ApiError } from "../../models/api_error";
import { User } from "../../models/user";
import { parseRetrievedBirthdays } from "../../services/calendar/birthdays";
import { getBirthdayEvents } from "../../services/calendar/events";

export const allBirthdays = async (req: Request, res: Response, next: NextFunction) => {
    getBirthdayEvents(req.user as User, parseInt((req.query.count || CALENDAR_CONFIG.DEFAULT_EVENT_COUNT).toString()))
        .then(response => parseRetrievedBirthdays(response))
        .then(Birthdays => res.json(Birthdays).status(200))
        .catch((err) => next(new ApiError("Error while retrieving calendar events", err, 500)))
}
