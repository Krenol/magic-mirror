import Typography from '@mui/material/Typography';
import React, { useCallback } from 'react';
import { card_small } from '../../assets/styles/cards';
import { smallFontSize } from '../../assets/styles/theme';
import { useAppDispatch } from '../../app/hooks';
import { setNewDay } from './timeSlice';
import { useGetTime } from '../../apis/current_time';
import { CardFrame } from '../CardFrame';

export const Time = () => {
    const dispatch = useAppDispatch();

    const newDayCb = useCallback(async (isNewDay: boolean) => {
        dispatch(setNewDay(isNewDay));
    }, [dispatch]);

    const {
        data: time,
        isLoading,
        error
    } = useGetTime(newDayCb)

    const content = <React.Fragment>
        <Typography color="text.primary" variant="body1" gutterBottom>
            {time?.currentDate}
        </Typography>
        <Typography variant="h3">
            {time?.hour}:{time?.minute}
        </Typography>
        <Typography variant='subtitle2' color="text.secondary" gutterBottom sx={smallFontSize}>
            Timezone UTC{time?.timezoneOffset}
        </Typography>
    </React.Fragment>

    if (isLoading) return (<CardFrame cardContent={"Loading..."} cardStyle={card_small} />);

    if (error) return (<CardFrame cardContent={"Error!"} cardStyle={card_small} />);

    return (<CardFrame cardContent={content} cardStyle={card_small} />);
}

export default Time;