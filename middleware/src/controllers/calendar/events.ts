import { CALENDAR_CONFIG } from "../../config/google"
import { NextFunction, Request, Response } from "express";
import { getCalendarEvents, parseNextEvent, parseRetrievedEvents } from "../../services/calendar/events";
import { GoogleUser } from "../../models/express_user";
import { ApiError } from "../../models/api_error";
import { EventRequestParams } from "../../models/calendar";

export const allEvents = async (req: Request, res: Response, next: NextFunction) => {
    return parseRequestParams(req)
        .then(params => getCalendarEvents(req.user as GoogleUser, params))
        .then(events => parseRetrievedEvents(events))
        .then(response => res.json(response).status(200))
        .catch((err) => next(new ApiError('Error while retrieving calendar events', err, 500)))
}

const parseRequestParams = async (req: Request): Promise<EventRequestParams> => {
    return {
        maxResults: parseInt((req.query.count || CALENDAR_CONFIG.DEFAULT_EVENT_COUNT).toString()),
        startTime: req.query.startDate?.toString() || (new Date()).toISOString(),
        endTime: req.query.endDate?.toString() || undefined
    }
}

export const nextEvent = async (req: Request, res: Response, next: NextFunction) => {
    return buildRequestParams(1)
        .then(params => getCalendarEvents(req.user as GoogleUser, params))
        .then(events => parseNextEvent(events))
        .then(response => res.json(response).status(200))
        .catch((err) => next(new ApiError('Error while retrieving next calendar event', err, 500)))
}

export const buildRequestParams = async (maxResults: number = 1, startTime: string = (new Date()).toISOString(), endTime: string | undefined = undefined): Promise<EventRequestParams> => {
    return {
        maxResults,
        startTime,
        endTime
    }
}