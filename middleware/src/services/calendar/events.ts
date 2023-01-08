import { CALENDAR_CONFIG, GOOGLE_CALENDAR_ENDPOINT } from "../../config/google";
import { events_list, GcalApiEventList, GcalApiEventResource } from "../../models/calendar";
import { User } from "../../models/user";
import { fetchJson } from "../fetch";
import { LOGGER } from "../loggers";
import { getAccessToken, getEmail } from "../user";

export const getCalendarEvents = async (user: User, maxResults: number = CALENDAR_CONFIG.DEFAULT_EVENT_COUNT, orderBy = 'startTime'): Promise<GcalApiEventList> => {
    const email = await getEmail(user);
    const access_token = await getAccessToken(user);
    const events = await getEvents(email, access_token, maxResults, orderBy);
    return events;
}

export const getBirthdayEvents = async (user: User, maxResults: number = CALENDAR_CONFIG.DEFAULT_EVENT_COUNT, orderBy = 'startTime'): Promise<GcalApiEventList> => {
    const access_token = await getAccessToken(user);
    const calendarID = encodeURIComponent(CALENDAR_CONFIG.BIRTHDAY_ID);
    return getEvents(calendarID, access_token, maxResults, orderBy);
}

export const getEvents = async (calendarId: string, access_token: string, maxResults: number = CALENDAR_CONFIG.DEFAULT_EVENT_COUNT, orderBy = 'startTime'): Promise<GcalApiEventList> => {
    const url = await buildApiUrl(calendarId, maxResults, orderBy)
    LOGGER.info(`Retrieving events via call to ${url}`)
    return fetchJson(url, { headers: { Authorization: `Bearer ${access_token}` } })
        .then(data => data.body as GcalApiEventList)
        .catch(err => { throw err })
}

const buildApiUrl = async (calendarId: string, maxResults: number = CALENDAR_CONFIG.DEFAULT_EVENT_COUNT, orderBy = 'startTime'): Promise<string> => {
    const now = (new Date()).toISOString();
    const query = `timeMin=${now}&maxResults=${maxResults}&singleEvents=true&orderBy=${orderBy}`;
    const url = `${GOOGLE_CALENDAR_ENDPOINT}/${calendarId}/events?${query}`
    return url;
}

export const parseRetrievedEvents = async (events: GcalApiEventList): Promise<events_list> => {
    return {
        count: events.items.length,
        list: events.items
    };
}

export const parseNextEvent = async (events: GcalApiEventList): Promise<GcalApiEventResource> => {
    return events.items[0];
}