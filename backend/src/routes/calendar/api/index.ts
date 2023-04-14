import { CALENDAR_CONFIG } from "config/google"
import { NextFunction, Request, Response } from "express";
import { getCalendarEvents, parseRetrievedEvents } from "routes/calendar/services";
import { GoogleUser } from "models/api/express_user";
import { ApiError } from "models/api/api_error";
import { EventList, EventRequestParams } from "models/api/calendar";
import { getISODayEndString, getISODayStartString, isSameDate, isToday } from "services/dateParser";
import { LOGGER } from "services/loggers";

export const allCalendarEvents = async (req: Request, res: Response, next: NextFunction) => {
    const count = await parseCountQueryParameter(req);
    const minTime = await parseMinTimeParam(req);
    const maxTime = await parseMaxTimeQueryParam(req);
    return getRequestParams(count, minTime, maxTime)
        .then(params => getCalendarEvents(req.user as GoogleUser, params))
        .then(parseRetrievedEvents)
        .then(events => res.status(200).json(events))
        .catch((err) => next(new ApiError('Error while retrieving calendar events', err, 500)))
}

export const eventsAtDate = async (req: Request, res: Response, next: NextFunction) => {
    const count = await parseCountQueryParameter(req);
    const date = await parseDateQueryParam(new Date(req.params.date.toString()));
    const maxTime = await getISODayEndString(new Date(req.params.date.toString()));
    return getRequestParams(count, date, maxTime)
        .then(params => getCalendarEvents(req.user as GoogleUser, params))
        .then(parseRetrievedEvents)
        .then(ev => applyDateFilter(ev, date))
        .then(events => res.status(200).json(events))
        .catch((err) => next(new ApiError('Error while retrieving calendar events', err, 500)))
}

const parseCountQueryParameter = async (req: Request): Promise<string> => {
    return (req.query.count || CALENDAR_CONFIG.DEFAULT_EVENT_COUNT).toString();
}

const parseMinTimeParam = async (req: Request): Promise<string> => {
    if (req.query.minTime) return req.query.minTime.toString();
    return (new Date()).toISOString();
}

const parseMaxTimeQueryParam = async (req: Request): Promise<string | undefined> => {
    if (req.query.maxTime) return req.query.maxTime.toString();
}

const getRequestParams = async (count: string, minTime: string, maxTime?: string): Promise<EventRequestParams> => {
    return {
        maxResults: parseInt(count),
        minTime,
        maxTime
    }
}

const parseDateQueryParam = async (date: Date): Promise<string> => {
    if (await isToday(date)) return (new Date()).toISOString();
    return await getISODayStartString(date);
}

const applyDateFilter = async (events: EventList, date: string) => {
    LOGGER.info(`Filter for events with startDate ${date}`);
    const ev = events.list.filter(x => isSameDate(new Date(date), new Date(x.start)));
    return {
        count: ev.length,
        list: ev
    };
}
