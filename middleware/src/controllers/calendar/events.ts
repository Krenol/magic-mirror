import { CALENDAR_CONFIG } from "../../config/google"
import { Request, Response } from "express";
import { createApiError } from "../../services/error_message";
import { getCalendarEvents, parseNextEvent, parseRetrievedEvents } from "../../services/calendar/events";
import { User } from "../../models/user";
import { ExpressResponse } from "../../models/fetch";

export const allEvents = async (req: Request, res: Response): Promise<ExpressResponse> => {
    return getCalendarEvents(req.user as User, parseInt((req.query.count || CALENDAR_CONFIG.DEFAULT_EVENT_COUNT).toString()))
        .then(events => parseRetrievedEvents(events))
        .then(response => res.json(response).status(200))
        .catch(() => createApiError(res, "Error while retrieving calendar events", 500))
}

export const nextEvent = async (req: Request, res: Response): Promise<ExpressResponse> => {
    return getCalendarEvents(req.user as User, 1)
        .then(events => parseNextEvent(events))
        .then(response => res.json(response).status(200))
        .catch(() => createApiError(res, "Error while retrieving next calendar event", 500))
}
