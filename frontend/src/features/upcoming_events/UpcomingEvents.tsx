import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { cardStyle, parentBoxStyle } from './style';
import { CardFrame } from '../CardFrame';
import { useGetEvents } from '../../apis/events';
import { getDateInXDays, getISODayEndString, getISODayStartString } from '../../app/dateParser';
import { EventList } from '../../models/calendar';
import { Event } from "./event/Event"
import { boldText, xSmallFontSize } from '../../assets/styles/theme';

type UpcomingEventObject = {
    todayEvents: EventList | undefined,
    tmrwEvents: EventList | undefined,
    overmrwEvents: EventList | undefined,
    loading: boolean,
    errors: Array<Error | null>
}

enum NoEventsEnum {
    today = "No events today",
    tmrw = "No events tomorrow",
    overmrw = "No events overmorrow"
}

const UpcomingEvents = () => {
    const upcomingEvents = GetUpcomingEvents();

    const todaysEventItems = (upcomingEvents.todayEvents?.count || 0) > 0 ?
        upcomingEvents.todayEvents?.list.map((ev) => <Event item={ev} showDetails={(upcomingEvents.todayEvents?.count || 0) === 2} />) :
        noEventsItem(NoEventsEnum.today);

    const tmrwsEventItems = (upcomingEvents.tmrwEvents?.count || 0) > 0 ?
        upcomingEvents.tmrwEvents?.list.map((ev) => <Event item={ev} showDetails={(upcomingEvents.tmrwEvents?.count || 0) === 1} />) :
        noEventsItem(NoEventsEnum.tmrw);

    const overmrwsEventItems = (upcomingEvents.overmrwEvents?.count || 0) > 0 ?
        upcomingEvents.overmrwEvents?.list.map((ev) => <Event item={ev} showDetails={(upcomingEvents.overmrwEvents?.count || 0) === 1} />) :
        noEventsItem(NoEventsEnum.overmrw);

    const boxContent = <Box>
        <Typography variant="h6">
            TODAY
        </Typography>
        {todaysEventItems}
    </Box>

    const cardContent = <Box>
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

const noEventsItem = (timeFrame: NoEventsEnum) => {
    return <Typography color="text.secondary" variant='subtitle2'>{timeFrame}</Typography>;
}

export default UpcomingEvents;