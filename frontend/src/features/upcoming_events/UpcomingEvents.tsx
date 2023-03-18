import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { cardStyle, columnBoxStyle, parentBoxStyle } from './style';
import { CardFrame } from '../CardFrame';
import { useGetEvents } from '../../apis/events';
import { getDateInXDays, getISODayEndString, getISODayStartString } from '../../app/dateParser';
import { EventList } from '../../models/calendar';
import { Event } from "./event/Event"
import { boldText, xSmallFontSize } from '../../assets/styles/theme';
import React from 'react';
import { EventItem } from "../../models/calendar";

type UpcomingEventObject = {
    todayEvents: EventList | undefined,
    tmrwEvents: EventList | undefined,
    overmrwEvents: EventList | undefined,
    loading: boolean,
    errors: Array<Error | null>
}

enum EventTextEnum {
    noEventsToday = "No more events today",
    noEvents = "No events",
    manyToday = "{{X}} more events",
    many = "{{X}} events"
}

const UpcomingEvents = () => {
    const upcomingEvents = GetUpcomingEvents();

    const todaysEventItems = GetTodaysEventItems(upcomingEvents.todayEvents);

    const tmrwsEventItems = GetFutureEventItems(upcomingEvents.tmrwEvents);

    const overmrwsEventItems = GetFutureEventItems(upcomingEvents.overmrwEvents);

    const boxContent = <Box sx={columnBoxStyle}>
        <Typography variant="body1">
            TODAY
        </Typography>
        {todaysEventItems}
    </Box>

    const cardContent = <Box sx={columnBoxStyle}>
        <Box>
            <Typography sx={{ ...xSmallFontSize, ...boldText }}>
                TOMORROW
            </Typography>
            {tmrwsEventItems}
        </Box>
        <Box>
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
    const {
        data: todayEvents,
        isLoading: todayLoading,
        error: todayError
    } = useGetEvents([
        {
            name: 'endDate',
            value: getISODayEndString(new Date())
        }
    ]);

    const {
        data: tmrwEvents,
        isLoading: tmrwLoading,
        error: tmrwError
    } = useGetEvents([
        {
            name: 'startDate',
            value: getISODayStartString(getDateInXDays(1))
        },
        {
            name: 'endDate',
            value: getISODayEndString(getDateInXDays(1))
        }
    ]);

    const {
        data: overmrwEvents,
        isLoading: overmrwLoading,
        error: overmrwError
    } = useGetEvents([
        {
            name: 'startDate',
            value: getISODayStartString(getDateInXDays(2))
        },
        {
            name: 'endDate',
            value: getISODayEndString(getDateInXDays(2))
        }
    ]);

    return {
        todayEvents,
        tmrwEvents,
        overmrwEvents,
        loading: todayLoading || tmrwLoading || overmrwLoading,
        errors: [todayError, tmrwError, overmrwError]
    }
}

const GetTodaysEventItems = (events: EventList | undefined): JSX.Element | JSX.Element[] | undefined => {
    const eventCount = (events?.count || 0);
    if (eventCount === 0) return NoEventsItem(EventTextEnum.noEventsToday);
    if (eventCount <= 2) return events?.list.map((ev) => <Event item={ev} showDetails={true} />);
    const summary = EventTextEnum.manyToday.replace("{{X}}", `${eventCount - 1}`);
    const eventItem: EventItem = {
        summary,
        description: "",
        start: events!.list[1].start,
        end: events!.list[eventCount - 1].end,
        location: ""
    }
    return (
        <React.Fragment>
            <Event item={events!.list[0]} showDetails={true} />
            <Event item={eventItem} showDetails={true} />
        </React.Fragment>
    )
}

const GetFutureEventItems = (events: EventList | undefined): JSX.Element | undefined => {
    const eventCount = (events?.count || 0);
    if (eventCount === 0) return NoEventsItem(EventTextEnum.noEvents);
    if (eventCount === 1) return <Event item={events!.list[0]} showDetails={true} />;
    const summary = EventTextEnum.many.replace("{{X}}", `${eventCount}`);
    const eventItem: EventItem = {
        summary,
        description: "",
        start: events!.list[0].start,
        end: events!.list[eventCount - 1].end,
        location: ""
    }
    return <Event item={eventItem} showDetails={true} />;
}

const NoEventsItem = (timeFrame: EventTextEnum): JSX.Element => {
    return <Typography color="text.secondary" sx={xSmallFontSize}>{timeFrame}</Typography>;
}

export default UpcomingEvents;