import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { getLocaleDateString, getTimeDifferenceInHours, getTimeFromDate, isSameDate } from "../../../helpers/dateParser";
import { xSmallFontSize } from "../../../assets/styles/theme";
import { EventItem } from "../../../models/calendar";
import { DEFAULT_LOCALE } from "../../../constants/defaults";
import { boxStyle, hideTextOverflow } from "../../../assets/styles/coloredBox";
import { colorBoxDimen } from "../style";

interface IEventItem {
    item: EventItem,
    date: Date
}

export const Event = ({ item, date }: IEventItem) => {
    const [startDate] = useState(new Date(item.start))
    const [endDate] = useState(new Date(item.end))
    const [summary, setSummary] = useState(item.summary)
    const [location, setLocation] = useState(item.location)
    const [dayTimeDiff, setDayTimeDiff] = useState<boolean>()
    const [sameStartDate, setSameStartDate] = useState<boolean>()
    const localeStrOpts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

    useEffect(() => {
        setSummary(item.summary ?? "");
        setLocation(item.location ?? "");
        isSameDate(date, startDate)
            .then(setSameStartDate)
    }, [item.summary, item.location, startDate, endDate, date]);

    useEffect(() => {
        const thisDate = sameStartDate ? startDate : new Date();
        getTimeDifferenceInHours(thisDate, endDate)
            .then(x => x < 24)
            .then(setDayTimeDiff);
    }, [sameStartDate, startDate, endDate])

    const eventStartString = sameStartDate ? '' : `${getLocaleDateString(startDate, DEFAULT_LOCALE, localeStrOpts)} `
    const eventEndString = dayTimeDiff ? '' : `${getLocaleDateString(endDate, DEFAULT_LOCALE, localeStrOpts)} `
    const eventTime = item.allDay ? 'All day' : `${eventStartString}${getTimeFromDate(startDate)}-${eventEndString}${getTimeFromDate(endDate)}`

    const details = <React.Fragment>
        <Typography variant="subtitle2" color="text.secondary" align="left" sx={{ ...xSmallFontSize, ...hideTextOverflow }}>
            {eventTime}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" align="left" sx={{ ...xSmallFontSize, ...hideTextOverflow }}>
            {location}
        </Typography>
    </React.Fragment>

    return (
        <Box sx={{ ...boxStyle, ...colorBoxDimen }}>
            <Typography variant="subtitle2" color="text.primary" align="left" sx={{ ...xSmallFontSize, ...hideTextOverflow }}>
                {summary}
            </Typography>
            {details}
        </Box>
    );
}