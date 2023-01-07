import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { parseTime } from '../../app/timeParser';
import { getDay, getDayName, getMonth, getTimezoneOffset, getYear } from '../../app/dateParser';
import { card_small } from '../../assets/styles/cards';
import { smallFontSize } from '../../assets/styles/theme';

export const Time = () => {
    const parseDate = useCallback((date: Date, delim: string = "."): string => {
        return `${getDayName(date, 'en-us')} ${[getDay(date), getMonth(date), getYear(date)].join(delim)}`
    }, []);

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
    }, [parseDate])


    return (
        <Card sx={card_small}>
            <Typography color="text.primary" variant="body1" gutterBottom>
                {currentDate}
            </Typography>
            <Typography variant="h3">
                {hours}:{minutes}
            </Typography>
            <Typography variant='subtitle2' color="text.secondary" gutterBottom sx={smallFontSize}>
                Timezone UTC{timezoneOffset}
            </Typography>
        </Card >
    );
}

export default Time;