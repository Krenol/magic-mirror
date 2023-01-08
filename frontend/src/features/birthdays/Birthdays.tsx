import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { birthday_list } from '../../models/birthdays';
import { fetchJson } from '../../app/fetch';
import { BIRHTDAY_API } from '../../constants/api';
import { BIRTHDAY_COUNT } from '../../constants/events';
import { Box } from '@mui/material';
import { cardStyle, headingBoxStyle } from './style';
import CakeIcon from '@mui/icons-material/Cake';
import BirthdayItem from './BirthdayItem/BirthdayItem';
import { useAppSelector } from '../../app/hooks';
import { isNewDay } from '../time/timeSlice';

export const Birthdays = () => {
    const [birthdays, setBirthdays] = useState<birthday_list>();
    const newDayBegun = useAppSelector(isNewDay);

    const getBirthdays = useCallback(async () => {
        fetchJson(`${BIRHTDAY_API}?count=${BIRTHDAY_COUNT}`)
            .then(data => setBirthdays(data as birthday_list))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        getBirthdays()
        const timer = setInterval(() => {
            getBirthdays()
        }, 3.6e+6)
        return () => clearInterval(timer);
    }, [getBirthdays, newDayBegun])


    return (
        <Card sx={cardStyle}>
            <Box sx={headingBoxStyle}>
                <Typography color="text.primary" variant="body1" gutterBottom>
                    Upcoming Birthdays
                </Typography>
                <CakeIcon fontSize='small' />
            </Box>
            {birthdays?.list.map((data) => (
                <BirthdayItem item={data} key={data.name} />
            ))}
        </Card >
    );
}

export default Birthdays;