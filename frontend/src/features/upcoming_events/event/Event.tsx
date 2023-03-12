import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { getTimeFromDate } from "../../../app/dateParser";
import { xSmallFontSize } from "../../../assets/styles/theme";
import { EventItem } from "../../../models/calendar";
import { sx } from "./style";

interface IEventItem {
    item: EventItem,
    showDetails?: boolean
}

const MAX_STRING_LENGTH = 30
const SHOW_LOCATION = false

export const Event = ({ item, showDetails = true }: IEventItem) => {
    const [startDate] = useState(new Date(item.start))
    const [endDate] = useState(new Date(item.end))
    const [summary, setSummary] = useState(item.summary)
    const [location, setLocation] = useState(item.location)

    useEffect(() => {
        setSummary(trimTextToMaxLength(item.summary || "", MAX_STRING_LENGTH, '...'))
        setLocation(trimTextToMaxLength(item.location || "", MAX_STRING_LENGTH, '...'))
    }, [item.summary, item.location]);

    const locationItem = <React.Fragment>
        <Typography variant="subtitle2" color="text.secondary" align="left" sx={xSmallFontSize}>
            {location}
        </Typography>
    </React.Fragment>

    const details = <React.Fragment>
        {SHOW_LOCATION && locationItem}
        <Typography variant="subtitle2" color="text.secondary" align="left" sx={xSmallFontSize}>
            {getTimeFromDate(startDate)}-{getTimeFromDate(endDate)}
        </Typography>
    </React.Fragment>

    return (
        <Box sx={sx}>
            <Typography variant="subtitle2" color="text.primary" align="left" sx={xSmallFontSize}>
                {summary}
            </Typography>
            {showDetails && details}
        </Box>
    );
}

const trimTextToMaxLength = (str: string, lngth: number, fillOverLength: string = '...'): string => {
    if (str.length > lngth) {
        let split = str.replace(/[\r\n]+/g, " ").split(" ");
        let intermediate = "";
        let i = 0;
        do {
            intermediate += ` ${split[i]}`;
            i++;
        } while (intermediate.length + split[i].length < lngth)
        if (intermediate.length > lngth) {
            intermediate = intermediate.substring(0, lngth - fillOverLength.length) + fillOverLength
        }
        return intermediate;
    }
    return str;
}