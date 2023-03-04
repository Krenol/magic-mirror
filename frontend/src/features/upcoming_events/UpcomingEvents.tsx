import React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { cardStyle, parentBoxStyle } from './style';
import { CardFrame } from '../CardFrame';
import { useGetEvents } from '../../apis/events';
import { isToday } from '../../app/dateParser';

const UpcomingEvents = () => {
    const {
        data: events,
        isLoading,
        error
    } = useGetEvents();

    const todaysEvents = events?.list.filter((ev) => !isToday(new Date(ev.start)));


    const todaysEventItems = (todaysEvents?.length || 0) > 0 ? todaysEvents?.map((ev) => <Typography>{ev.summary}</Typography>) :
        <Typography color="text.secondary" variant='subtitle2'>No events today</Typography>;


    const boxContent = <React.Fragment>
        <Typography variant="h5">
            Today
        </Typography>
        {todaysEventItems}
    </React.Fragment>

    const cardContent = <Box

    />

    if (isLoading) return (<CardFrame boxContent={"Loading..."} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);

    if (error) return (<CardFrame boxContent={"Error!"} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);

    return (<CardFrame boxContent={boxContent} cardContent={cardContent} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);
}

export default UpcomingEvents;