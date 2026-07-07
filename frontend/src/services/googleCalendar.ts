import { externalFetchJson } from '../common/externalFetch'
import { getTimeDiff, TimeUnit } from '../common/dateParser'
import {
    CalendarEvent,
    CalendarEventList,
    CalendarListItem,
} from '../models/calendar'
import { Birthday, BirthdayList } from '../models/birthdays'

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3'

type GoogleEventDateTime = { dateTime?: string; date?: string }
type GoogleEvent = {
    summary?: string
    description?: string
    location?: string
    start?: GoogleEventDateTime
    end?: GoogleEventDateTime
}
type GoogleEventsResponse = { items?: GoogleEvent[] }
type GoogleCalendarListEntry = {
    summary?: string
    id?: string
    primary?: boolean
}
type GoogleCalendarListResponse = { items?: GoogleCalendarListEntry[] }

const authHeaders = (accessToken: string): RequestInit => ({
    headers: { Authorization: `Bearer ${accessToken}` },
})

const parseEvent = (event: GoogleEvent): CalendarEvent => {
    const start = new Date(event.start?.dateTime ?? event.start?.date ?? '')
    const end = new Date(event.end?.dateTime ?? event.end?.date ?? '')
    const timeDiff = getTimeDiff(start, end, TimeUnit.hours)
    return {
        summary: event.summary ?? '',
        description: event.description ?? '',
        location: event.location ?? '',
        start: start.toISOString(),
        end: end.toISOString(),
        allDay: timeDiff % 24 === 0,
        multiDays: timeDiff > 24,
    }
}

export const getEvents = async (
    accessToken: string,
    calendarId: string,
    timeMin: string,
    timeMax: string | undefined,
    maxResults: number
): Promise<CalendarEventList> => {
    const params = new URLSearchParams({
        timeMin,
        maxResults: String(maxResults),
        singleEvents: 'true',
        orderBy: 'startTime',
    })
    if (timeMax) {
        params.set('timeMax', timeMax)
    }
    const response = await externalFetchJson<GoogleEventsResponse>(
        `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events?${params.toString()}`,
        authHeaders(accessToken)
    )
    const list = (response.items ?? []).map(parseEvent)
    return { count: list.length, list }
}

const parseBirthday = (event: GoogleEvent): Birthday => {
    const name = event.summary ?? ''
    return {
        name: name.replace("'s Birthday", ''),
        date: event.start?.date ?? new Date().toISOString(),
    }
}

export const getBirthdays = async (
    accessToken: string,
    calendarId: string,
    maxResults: number
): Promise<BirthdayList> => {
    const params = new URLSearchParams({
        timeMin: new Date().toISOString(),
        maxResults: String(maxResults),
        singleEvents: 'true',
        orderBy: 'startTime',
    })
    const response = await externalFetchJson<GoogleEventsResponse>(
        `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events?${params.toString()}`,
        authHeaders(accessToken)
    )
    const list = (response.items ?? []).map(parseBirthday)
    return { count: list.length, list }
}

export const getCalendarList = async (
    accessToken: string
): Promise<CalendarListItem[]> => {
    const params = new URLSearchParams({ maxResults: '100' })
    const response = await externalFetchJson<GoogleCalendarListResponse>(
        `${CALENDAR_API_BASE}/users/me/calendarList?${params.toString()}`,
        authHeaders(accessToken)
    )
    return (response.items ?? []).map((cal) => ({
        name: cal.summary ?? '',
        id: cal.id ?? '',
        primary: cal.primary ?? false,
    }))
}
