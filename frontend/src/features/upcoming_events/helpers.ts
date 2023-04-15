import { useGetEvents, useGetDateEvents } from "../../apis/events";
import { getDateInXDays, getISODayEndString, getIsoDate } from "../../app/dateParser";
import { UpcomingEventObject, Dates } from "./types";

export const GetUpcomingEvents = (): UpcomingEventObject => {
    const dates: Dates = {
        today: new Date(),
        tmrw: getDateInXDays(1),
        overmrw: getDateInXDays(2)
    }
    const {
        data: todayEvents,
        isLoading: todayLoading,
        error: todayError
    } = useGetEvents([
        {
            name: 'maxTime',
            value: encodeURIComponent(getISODayEndString(new Date(), true))
        }
    ]);

    const {
        data: tmrwEvents,
        isLoading: tmrwLoading,
        error: tmrwError
    } = useGetDateEvents(getIsoDate(dates.tmrw));

    const {
        data: overmrwEvents,
        isLoading: overmrwLoading,
        error: overmrwError
    } = useGetDateEvents(getIsoDate(dates.overmrw));

    return {
        todayEvents,
        tmrwEvents,
        overmrwEvents,
        loading: todayLoading || tmrwLoading || overmrwLoading,
        errors: [todayError, tmrwError, overmrwError],
        dates
    }
}