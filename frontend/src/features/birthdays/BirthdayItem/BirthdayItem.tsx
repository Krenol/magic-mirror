import { Typography, SxProps } from "@mui/material";
import { Birthday } from "../../../models/birthdays";
import { boldText } from '../../../assets/styles/theme';
import { useEffect, useState } from "react";
import { getDifferenceInDays } from "../../../app/dateParser";
import { Theme } from "@emotion/react"

interface IBirthdayItem {
    item: Birthday,
}

const BirthdayItem = ({ item }: IBirthdayItem) => {
    const [days, setDays] = useState(0)
    const [sx, setSx] = useState<SxProps<Theme>>()
    const [color, setColor] = useState('text.secondary')
    const [timeText, setTimeText] = useState("")

    useEffect(() => {
        const bday = new Date(item.date);
        const today = new Date(new Date().toDateString());
        getDifferenceInDays(today, bday)
            .then(setDays)
    }, [item.date])

    useEffect(() => {
        if (days === 0) {
            setSx(boldText);
            setColor('text.primary')
            setTimeText('today')
        } else if (days === 1) {
            setSx(undefined)
            setColor('text.primary')
            setTimeText(`tomorrow`)
        }
        else {
            setSx(undefined)
            setColor('text.secondary')
            setTimeText(`in ${days} days`)
        }
    }, [days])

    return (
        <Typography color={color} variant="subtitle2" sx={sx}>
            {item.name} {timeText}
        </Typography>
    )
}

export default BirthdayItem