import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { parseTime } from '../../app/timeParser';
import { getTimezoneOffset, parseDate } from './dateParser';
import { card_small } from '../../assets/styles/cards';

export const Time = () => {
    const [hours, setHours] = useState(parseTime(new Date().getHours()));
    const [minutes, setMinutes] = useState(parseTime(new Date().getMinutes()));
    const [currentDate, setCurrentDate] = useState(parseDate(new Date()));
    const [timezoneOffset, setTimezoneOffset] = useState(getTimezoneOffset());
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setHours(parseTime(now.getHours()));
            setMinutes(parseTime(now.getMinutes()));
            setCurrentDate(parseDate(now));
            setTimezoneOffset(getTimezoneOffset())
        }, 5000)
        return () => clearInterval(timer);
    }, [])


    return (
        <Card sx={card_small}>
            <Typography color="text.secondary" variant="body1" gutterBottom>
                {currentDate}
            </Typography>
            <Typography variant="h3">
                {hours}:{minutes}
            </Typography>
            <Typography variant='subtitle2' color="text.secondary" gutterBottom>
                Timezone UTC{timezoneOffset}
            </Typography>
        </Card >
    );
}

export default Time;