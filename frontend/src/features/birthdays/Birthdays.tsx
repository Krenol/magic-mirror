import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { cardStyle, headingBoxStyle } from './style';
import CakeIcon from '@mui/icons-material/Cake';
import BirthdayItem from './BirthdayItem/BirthdayItem';
import { useAppSelector } from '../../app/hooks';
import { isNewDay } from '../time/timeSlice';
import { useGetBirthdays } from '../../apis/birthday';
import { CardFrame } from '../CardFrame';

export const Birthdays = () => {
    const newDayBegun = useAppSelector(isNewDay);

    const {
        data: birthdays,
        isLoading,
        error,
        refetch
    } = useGetBirthdays();

    useEffect(() => {
        refetch()
    }, [newDayBegun]);

    const content = <React.Fragment>
        <Box sx={headingBoxStyle}>
            <Typography color="text.primary" variant="body1" gutterBottom>
                Upcoming Birthdays
            </Typography>
            <CakeIcon fontSize='small' />
        </Box>
        {birthdays?.list.map((data) => (
            <BirthdayItem item={data} key={data.name} />
        ))}
    </React.Fragment>

    if (isLoading) return (<CardFrame cardContent={"Loading..."} cardStyle={cardStyle} />);

    if (error) return (<CardFrame cardContent={"Error!"} cardStyle={cardStyle} />);

    return (<CardFrame cardContent={content} cardStyle={cardStyle} />);
}

export default Birthdays;