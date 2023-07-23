import Typography from '@mui/material/Typography';
import { useCallback } from 'react';
import { smallFontSize } from '../../assets/styles/theme';
import { useAppDispatch } from '../../helpers/hooks';
import { setNewDay } from './timeSlice';
import { useGetTime } from '../../apis/current_time';
import { CardFrame } from '../CardFrame';
import { Box } from '@mui/material';
import { cardStyle, timeStyle } from './style';

export const Time = () => {
    const dispatch = useAppDispatch();

    const newDayCb = useCallback((isNewDay: boolean) => {
        dispatch(setNewDay(isNewDay));
    }, [dispatch]);

    const {
        data: time,
        isLoading,
        error
    } = useGetTime(newDayCb)

    const content = <Box sx={timeStyle}>
        <Typography variant='subtitle2' color="text.primary">
            {time?.weekdayLong}
        </Typography>
        <Typography color="text.primary" variant="body1">
            {time?.currentDate}
        </Typography>
        <Typography variant="h3">
            {time?.hour}:{time?.minute}
        </Typography>
        <Typography variant='subtitle2' color="text.secondary" sx={smallFontSize}>
            Timezone UTC{time?.timezoneOffset}
        </Typography>
    </Box>

    if (isLoading) return (<CardFrame cardContent={"Loading..."} cardStyle={cardStyle} />);

    if (error) return (<CardFrame cardContent={"Error!"} cardStyle={cardStyle} />);

    return (<CardFrame cardContent={content} cardStyle={cardStyle} />);
}

export default Time;