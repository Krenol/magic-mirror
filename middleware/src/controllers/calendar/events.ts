import { CALENDAR_CONFIG } from "../../config/google"
import { NextFunction, Request, Response } from "express";
import { getCalendarEvents, parseNextEvent, parseRetrievedEvents } from "../../services/calendar/events";
import { User } from "../../models/user";
import { ApiError } from "../../models/api_error";

export const allEvents = async (req: Request, res: Response, next: NextFunction) => {
    return getCalendarEvents(req.user as User, parseInt((req.query.count || CALENDAR_CONFIG.DEFAULT_EVENT_COUNT).toString()))
        .then(events => parseRetrievedEvents(events))
        .then(response => res.json(response).status(200))
        .catch((err) => next(new ApiError('Error while retrieving calendar events', err, 500)))
}

export const nextEvent = async (req: Request, res: Response, next: NextFunction) => {
    return getCalendarEvents(req.user as User, 1)
        .then(events => parseNextEvent(events))
        .then(response => res.json(response).status(200))
        .catch((err) => next(new ApiError('Error while retrieving next calendar event', err, 500)))
}
