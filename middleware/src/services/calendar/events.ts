import { CALENDAR_CONFIG } from "../../config/google";
import { User } from "../../models/user";
import { fetchJson } from "../fetch";
import { getAccessToken, getEmail } from "../user";

export const getCalendarEvents = async (user: User, maxResults: number = CALENDAR_CONFIG.DEFAULT_EVENT_COUNT, orderBy = 'startTime'): Promise<any> => {
    const email = await getEmail(user);
    const access_token = await getAccessToken(user);
    const events = await getEvents(email, access_token, maxResults, orderBy);
    return events;
}

export const getBirthdayEvents = async (user: User, maxResults: number = CALENDAR_CONFIG.DEFAULT_EVENT_COUNT, orderBy = 'startTime'): Promise<any> => {
    const access_token = await getAccessToken(user);
    const calendarID = encodeURIComponent(CALENDAR_CONFIG.BIRTHDAY_ID);
    return getEvents(calendarID, access_token, maxResults, orderBy);
}

export const getEvents = async (calendarId: string, access_token: string, maxResults: number = CALENDAR_CONFIG.DEFAULT_EVENT_COUNT, orderBy = 'startTime'): Promise<any> => {
    const url = await buildApiUrl(calendarId, maxResults, orderBy)
    return fetchJson(url, { headers: { Authorization: `Bearer ${access_token}` } })
}

const buildApiUrl = async (calendarId: string, maxResults: number = CALENDAR_CONFIG.DEFAULT_EVENT_COUNT, orderBy = 'startTime'): Promise<string> => {
    const now = (new Date()).toISOString();
    const query = `timeMin=${now}&maxResults=${maxResults}&singleEvents=true&orderBy=${orderBy}`;
    return `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${query}`
}

export const parseRetrievedEvents = async (events: any): Promise<any> => {
    return {
        count: events.items.length,
        list: events.items
    };
}

export const parseNextEvent = async (events: any): Promise<any> => {
    return events.items[0];
}