import { EventList } from "../../models/calendar"

export type Dates = {
    today: Date,
    tmrw: Date,
    overmrw: Date
}

export type UpcomingEventObject = {
    todayEvents: EventList | undefined,
    tmrwEvents: EventList | undefined,
    overmrwEvents: EventList | undefined,
    loading: boolean,
    errors: Array<Error | null>
    dates: Dates
}

export enum EventTextEnum {
    noEventsToday = "No more events today",
    noEvents = "No events",
    manyToday = "{{X}} more events",
    many = "{{X}} events"
}