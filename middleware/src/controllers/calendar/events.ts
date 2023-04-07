import { CALENDAR_CONFIG } from "../../config/google"
import { NextFunction, Request, Response } from "express";
import { getCalendarEvents, parseNextEvent, parseRetrievedEvents } from "../../services/calendar/events";
import { GoogleUser } from "../../models/express_user";
import { ApiError } from "../../models/api_error";
import { EventList, EventRequestParams } from "../../models/calendar";
import { getISODayEndString, getISODayStartString, isSameDate, isToday } from "../../services/dateParser";
import { LOGGER } from "../../services/loggers";

export const allEvents = async (req: Request, res: Response, next: NextFunction) => {
    return parseQueryRequestParams(req)
        .then(params => getCalendarEvents(req.user as GoogleUser, params))
        .then(parseRetrievedEvents)
        .then(events => applyStartDateQueryFilter(req, events))
        .then(events => res.status(200).json(events))
        .catch((err) => next(new ApiError('Error while retrieving calendar events', err, 500)))
}

const parseQueryRequestParams = async (req: Request): Promise<EventRequestParams> => {
    return {
        maxResults: parseInt((req.query.count || CALENDAR_CONFIG.DEFAULT_EVENT_COUNT).toString()),
        minTime: await parseMinTimeParam(req),
        maxTime: await parseMaxTimeQueryParam(req)
    }
}

const parseMinTimeParam = async (req: Request): Promise<string> => {
    if (req.query.minTime) return req.query.minTime!.toString();
    if (req.query.startDate) return parseStartDateQueryParam(new Date(req.query.startDate!.toString()));
    return (new Date()).toISOString();
}

const parseStartDateQueryParam = async (date: Date): Promise<string> => {
    if (await isToday(date)) return (new Date()).toISOString();
    return await getISODayStartString(date);
}

const parseMaxTimeQueryParam = async (req: Request): Promise<string | undefined> => {
    if (req.query.maxTime) return req.query.maxTime!.toString();
    if (req.query.startDate) return getISODayEndString(new Date(req.query.startDate!.toString()));
    return;
}

const applyStartDateQueryFilter = async (req: Request, events: EventList) => {
    if (req.query.startDate) {
        LOGGER.warn(`Filter for events with startDate ${req.query.startDate!.toString()}`)
        const date = new Date(req.query.startDate!.toString())
        let ev = events.list.filter(x => isSameDate(date, new Date(x.start)))
        events = {
            count: ev.length,
            list: ev
        }
        LOGGER.warn(JSON.stringify(ev))
    }
    return events;
}

export const nextEvent = async (req: Request, res: Response, next: NextFunction) => {
    return getEventApiRequestParams(1)
        .then(params => getCalendarEvents(req.user as GoogleUser, params))
        .then(events => parseNextEvent(events))
        .then(response => res.status(200).json(response))
        .catch((err) => next(new ApiError('Error while retrieving next calendar event', err, 500)))
}

export const getEventApiRequestParams = async (maxResults: number = 1, minTime: string = (new Date()).toISOString(), maxTime: string | undefined = undefined): Promise<EventRequestParams> => {
    return {
        maxResults,
        minTime,
        maxTime
    }
}