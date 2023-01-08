import { CALENDAR_CONFIG } from "../../config/google";
import { events_list, gcal_api_event_list, gcal_api_event_resource } from "../../models/calendar";
import { User } from "../../models/user";
import { fetchJson } from "../fetch";
import { getAccessToken, getEmail } from "../user";

export const getCalendarEvents = async (user: User, maxResults: number = CALENDAR_CONFIG.DEFAULT_EVENT_COUNT, orderBy = 'startTime'): Promise<gcal_api_event_list> => {
    const email = await getEmail(user);
    const access_token = await getAccessToken(user);
    const events = await getEvents(email, access_token, maxResults, orderBy);
    return events;
}

export const getBirthdayEvents = async (user: User, maxResults: number = CALENDAR_CONFIG.DEFAULT_EVENT_COUNT, orderBy = 'startTime'): Promise<gcal_api_event_list> => {
    const access_token = await getAccessToken(user);
    const calendarID = encodeURIComponent(CALENDAR_CONFIG.BIRTHDAY_ID);
    return getEvents(calendarID, access_token, maxResults, orderBy);
}

export const getEvents = async (calendarId: string, access_token: string, maxResults: number = CALENDAR_CONFIG.DEFAULT_EVENT_COUNT, orderBy = 'startTime'): Promise<gcal_api_event_list> => {
    const url = await buildApiUrl(calendarId, maxResults, orderBy)
    return fetchJson(url, { headers: { Authorization: `Bearer ${access_token}` } })
        .then(data => data.body as gcal_api_event_list)
        .catch(err => { throw err })
}

const buildApiUrl = async (calendarId: string, maxResults: number = CALENDAR_CONFIG.DEFAULT_EVENT_COUNT, orderBy = 'startTime'): Promise<string> => {
    const now = (new Date()).toISOString();
    const query = `timeMin=${now}&maxResults=${maxResults}&singleEvents=true&orderBy=${orderBy}`;
    return `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${query}`
}

export const parseRetrievedEvents = async (events: gcal_api_event_list): Promise<events_list> => {
    return {
        count: events.items.length,
        list: events.items
    };
}

export const parseNextEvent = async (events: gcal_api_event_list): Promise<gcal_api_event_resource> => {
    return events.items[0];
}