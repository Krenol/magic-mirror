import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { parseTime } from '../../app/timeParser';
import { getDay, getDayName, getMonth, getTimezoneOffset, getYear } from '../../app/dateParser';
import { card_small } from '../../assets/styles/cards';
import { smallFontSize } from '../../assets/styles/theme';
import { gcal_api_event_list } from '../../models/events';
import { fetchJson } from '../../app/fetch';
import { BIRHTDAY_API } from '../../constants/api';
import { BIRTHDAY_COUNT } from '../../constants/events';

export const Birthdays = () => {
    const [birthdays, setBirthdays] = useState<gcal_api_event_list>();

    const getBirthdays = useCallback(async () => {
        fetchJson(`${BIRHTDAY_API}?count=${BIRTHDAY_COUNT}`)
            .then(data => setBirthdays(data as gcal_api_event_list))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        getBirthdays()
        const timer = setInterval(() => {
            getBirthdays()
        }, 3.6e+6)
        return () => clearInterval(timer);
    }, [getBirthdays])


    return (
        <Card sx={card_small}>
            <Typography color="text.primary" variant="body1" gutterBottom>
                TODO
            </Typography>
        </Card >
    );
}

export default Birthdays;