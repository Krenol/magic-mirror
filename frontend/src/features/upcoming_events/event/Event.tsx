import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { getTimeDifferenceInHours, getTimeFromDate, getDate, isSameDate } from "../../../app/dateParser";
import { xSmallFontSize } from "../../../assets/styles/theme";
import { EventItem } from "../../../models/calendar";
import { hideTextOverflow, sx } from "./style";

interface IEventItem {
    item: EventItem,
    showDetails?: boolean
}

const SHOW_LOCATION = true

export const Event = ({ item, showDetails = true }: IEventItem) => {
    const [startDate] = useState(new Date(item.start))
    const [endDate] = useState(new Date(item.end))
    const [summary, setSummary] = useState(item.summary)
    const [location, setLocation] = useState(item.location)
    const [timeDiffInHours, setTimeDiffInHours] = useState<number>()
    const [differentStartDate] = useState(isSameDate(new Date(), startDate))

    useEffect(() => {
        setSummary(item.summary || "");
        setLocation(item.location || "");
        getTimeDifferenceInHours(startDate, endDate)
            .then(setTimeDiffInHours);
    }, [item.summary, item.location, startDate, endDate]);

    const locationItem = <React.Fragment>
        <Typography variant="subtitle2" color="text.secondary" align="left" sx={{ ...xSmallFontSize, ...hideTextOverflow }}>
            {location}
        </Typography>
    </React.Fragment>

    const eventStartString = differentStartDate ? 'until ' : `${getTimeFromDate(startDate)}-`

    const eventTime = (timeDiffInHours || 0) < 24
        ? `${eventStartString}${getTimeFromDate(endDate)}`
        : `${eventStartString}${getDate(endDate)} ${getTimeFromDate(endDate)}`;

    const details = <React.Fragment>
        {SHOW_LOCATION && locationItem}
        <Typography variant="subtitle2" color="text.secondary" align="left" sx={{ ...xSmallFontSize, ...hideTextOverflow }}>
            {eventTime}
        </Typography>
    </React.Fragment>

    return (
        <Box sx={sx}>
            <Typography variant="subtitle2" color="text.primary" align="left" sx={{ ...xSmallFontSize, ...hideTextOverflow }}>
                {summary}
            </Typography>
            {showDetails && details}
        </Box>
    );
}
