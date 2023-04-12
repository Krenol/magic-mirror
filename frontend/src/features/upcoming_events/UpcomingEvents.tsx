import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { cardStyle, columnBoxStyle, parentBoxStyle } from './style';
import { CardFrame } from '../CardFrame';
import { useGetDateEvents, useGetEvents } from '../../apis/events';
import { getDateInXDays, getIsoDate, getISODayEndString } from '../../app/dateParser';
import { EventList, EventItem } from '../../models/calendar';
import { Event } from "./event/Event"
import { boldText, xSmallFontSize } from '../../assets/styles/theme';
import React from 'react';

type Dates = {
    today: Date,
    tmrw: Date,
    overmrw: Date
}

type UpcomingEventObject = {
    todayEvents: EventList | undefined,
    tmrwEvents: EventList | undefined,
    overmrwEvents: EventList | undefined,
    loading: boolean,
    errors: Array<Error | null>
    dates: Dates
}

enum EventTextEnum {
    noEventsToday = "No more events today",
    noEvents = "No events",
    manyToday = "{{X}} more events",
    many = "{{X}} events"
}

const UpcomingEvents = () => {
    const upcomingEvents = GetUpcomingEvents();

    const todaysEventItems = GetTodaysEventItems(upcomingEvents.todayEvents, upcomingEvents.dates.today);

    const tmrwsEventItems = GetFutureEventItems(upcomingEvents.tmrwEvents, upcomingEvents.dates.tmrw);

    const overmrwsEventItems = GetFutureEventItems(upcomingEvents.overmrwEvents, upcomingEvents.dates.overmrw);

    const boxContent = <Box sx={{ ...columnBoxStyle, ...{ gap: 1 } }}>
        <Typography variant="body1" sx={{ marginBottom: '1px' }}>
            TODAY
        </Typography>
        {todaysEventItems}
    </Box >

    const cardContent = <Box>
        <Box sx={{ ...columnBoxStyle, ...{ height: '50%' } }}>
            <Typography sx={{ ...xSmallFontSize, ...boldText }}>
                TOMORROW
            </Typography>
            {tmrwsEventItems}
        </Box>
        <Box sx={{ ...columnBoxStyle, ...{ height: '50%' } }}>
            <Typography sx={{ ...xSmallFontSize, ...boldText }}>
                OVERMORROW
            </Typography>
            {overmrwsEventItems}
        </Box>
    </Box>

    if (upcomingEvents.loading) {
        return (<CardFrame boxContent={"Loading..."} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);
    }

    if (upcomingEvents.errors.filter(Boolean).length > 0) {
        return (<CardFrame boxContent={"Error!"} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);
    }

    return (<CardFrame boxContent={boxContent} cardContent={cardContent} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);
}

const GetUpcomingEvents = (): UpcomingEventObject => {
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
            value: getISODayEndString(new Date())
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

const GetTodaysEventItems = (events: EventList | undefined, date: Date): JSX.Element | JSX.Element[] | undefined => {
    const eventCount = (events?.count || 0);
    if (eventCount === 0) return NoEventsItem(EventTextEnum.noEventsToday);
    if (eventCount <= 2) return events?.list.map((ev) => <Event item={ev} date={date} key={ev.start} />);
    const summary = EventTextEnum.manyToday.replace("{{X}}", `${eventCount - 1}`);
    const eventItem: EventItem = {
        summary,
        description: "",
        start: events!.list[1].start,
        end: events!.list[eventCount - 1].end,
        location: "",
        allDay: false
    }
    return (
        <React.Fragment>
            <Event item={events!.list[0]} date={date} key={events!.list[0].start} />
            <Event item={eventItem} date={date} key={eventItem.start} />
        </React.Fragment>
    )
}

const GetFutureEventItems = (events: EventList | undefined, date: Date): JSX.Element | undefined => {
    const eventCount = (events?.count || 0);
    if (eventCount === 0) return NoEventsItem(EventTextEnum.noEvents);
    if (eventCount === 1) return <Event item={events!.list[0]} date={date} key={events!.list[0].start} />;
    const summary = EventTextEnum.many.replace("{{X}}", `${eventCount}`);
    const eventItem: EventItem = {
        summary,
        description: "",
        start: events!.list[0].start,
        end: events!.list[eventCount - 1].end,
        location: "",
        allDay: false
    }
    return <Event item={eventItem} date={date} key={eventItem.start} />;
}

const NoEventsItem = (timeFrame: EventTextEnum): JSX.Element => {
    return <Typography color="text.secondary" sx={xSmallFontSize}>{timeFrame}</Typography>;
}

export default UpcomingEvents;