import { GOOGLE_CALENDAR_ENDPOINT } from "config";
import {
  EventList,
  EventItem,
  GcalApiEventList,
  GcalApiEventResource,
  EventRequestParams,
} from "models/api/calendar";
import { IDtoUser } from "models/mongo/users";
import { getTimeDiff, TimeUnit } from "services/dateParser";
import { fetchJson } from "services/fetch";
import { getAuthenticationHeader, getEmail } from "services/identity/user";

export const getCalendarEvents = async (
  user: IDtoUser,
  params: EventRequestParams,
  orderBy = "startTime"
): Promise<GcalApiEventList> => {
  const email = await getEmail(user);
  const events = await getEvents(email, user, params, orderBy);
  return events;
};

export const getEvents = async (
  calendarId: string,
  user: IDtoUser,
  params: EventRequestParams,
  orderBy = "startTime"
): Promise<GcalApiEventList> => {
  const url = await buildApiUrl(calendarId, params, orderBy);
  const authHeader = await getAuthenticationHeader(user);
  return fetchJson(url, authHeader)
    .then((data) => data.body as GcalApiEventList)
    .catch((err) => {
      throw err;
    });
};

const buildApiUrl = async (
  calendarId: string,
  params: EventRequestParams,
  orderBy = "startTime"
): Promise<string> => {
  let query = `timeMin=${encodeURIComponent(params.minTime)}&maxResults=${
    params.maxResults
  }&singleEvents=true&orderBy=${orderBy}`;
  query += params.maxTime
    ? `&timeMax=${encodeURIComponent(params.maxTime)}`
    : "";
  const url = `${GOOGLE_CALENDAR_ENDPOINT}/${calendarId}/events?${query}`;
  return url;
};

export const parseRetrievedEvents = async (
  events: GcalApiEventList
): Promise<EventList> => {
  return {
    count: events.items.length,
    list: await parseEvents(events.items),
  };
};

const parseEvents = async (
  gcalEventList: Array<GcalApiEventResource>
): Promise<Array<EventItem>> => {
  const allEvents: Array<Promise<EventItem>> = [];
  gcalEventList.forEach((e) => allEvents.push(parseEvent(e)));
  return Promise.all(allEvents);
};

export const parseNextEvent = async (
  events: GcalApiEventList
): Promise<EventItem> => {
  return parseEvent(events.items[0]);
};

const parseEvent = async (
  gcalEvent: GcalApiEventResource
): Promise<EventItem> => {
  const start = new Date(gcalEvent.start.dateTime ?? gcalEvent.start.date);
  const end = new Date(gcalEvent.end.dateTime ?? gcalEvent.end.date);
  const timeDiff = await getTimeDiff(start, end, TimeUnit.hours);
  return {
    summary: gcalEvent.summary,
    description: gcalEvent.description,
    location: gcalEvent.location,
    start: start.toISOString(),
    end: end.toISOString(),
    allDay: timeDiff % 24 === 0,
    multiDays: timeDiff > 24,
  };
};
