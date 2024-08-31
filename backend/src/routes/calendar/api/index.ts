import { CALENDAR_CONFIG } from 'config';
import { NextFunction, Request, Response } from 'express';
import { parseRetrievedEvents } from 'routes/calendar/services';
import { ApiError } from 'models/api/api_error';
import { getISODayEndString, getISODayStartString, isToday } from 'services/dateParser';
import { LOGGER } from 'services/loggers';
import { calendar_v3, google } from 'googleapis';
import { getOAuth2ClientForUser } from 'services/google';

export const allCalendarEvents = async (req: Request, res: Response, next: NextFunction) => {
  const auth = await getOAuth2ClientForUser(req.headers);
  const calendar = google.calendar({
    version: 'v3',
    auth,
  } as calendar_v3.Options);
  const maxResults = await parseCountQueryParameter(req);
  const timeMin = await parseMinTimeParam(req);
  const timeMax = await parseMaxTimeQueryParam(req);
  calendar.events
    .list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    })
    .then((events) => parseRetrievedEvents(events.data))
    .then((parsedEvents) => res.status(200).json(parsedEvents))
    .catch((err) => {
      LOGGER.error(err);
      next(new ApiError('Error while retrieving calendar events', err, 500));
    });
};

export const eventsAtDate = async (req: Request, res: Response, next: NextFunction) => {
  const auth = await getOAuth2ClientForUser(req.headers);
  const calendar = google.calendar({
    version: 'v3',
    auth,
  } as calendar_v3.Options);
  const maxResults = await parseCountQueryParameter(req);
  const timeMin = await parseDateQueryParam(new Date(req.params.date.toString()));
  const timeMax = await getISODayEndString(new Date(req.params.date.toString()));
  calendar.events
    .list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    })
    .then((events) => {
      LOGGER.info(events.data);
      return events;
    })
    .then((events) => {
      res.status(200).json(parseRetrievedEvents(events.data));
    })
    .catch((err) => next(new ApiError('Error while retrieving calendar events', err, 500)));
};

const parseCountQueryParameter = async (req: Request): Promise<number> => {
  return parseInt((req.query.count as string) ?? CALENDAR_CONFIG.DEFAULT_EVENT_COUNT);
};

const parseMinTimeParam = async (req: Request): Promise<string> => {
  if (req.query.minTime) return (req.query.minTime as string).toString();
  return new Date().toISOString();
};

const parseMaxTimeQueryParam = async (req: Request): Promise<string | undefined> => {
  if (req.query.maxTime) return (req.query.maxTime as string).toString();
};

const parseDateQueryParam = async (date: Date): Promise<string> => {
  if (await isToday(date)) return new Date().toISOString();
  return await getISODayStartString(date);
};
