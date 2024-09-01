import Typography from '@mui/material/Typography'
import { Box, Grid, Skeleton, Stack } from '@mui/material'
import { MediumCard } from '../CardFrame'
import { EventItem } from '../../models/calendar'
import { Event } from './Event'
import { xSmallFontSize } from '../../assets/styles/theme'
import React, { ReactElement, useEffect } from 'react'
import { EventTexts, TodayEventTexts, NextDaysEventTexts } from './types'
import { useGetEvents } from '../../apis/events'
import {
    getDateInXDays,
    getISODayEndString,
    getISODayStartString,
} from '../../common/dateParser'

const UpcomingEvents = ({ todaysDate }: { todaysDate: Date }) => {
    const [tomorrowsDate, setTomorrowsDate] = React.useState<Date>(
        getDateInXDays(1)
    )
    const [overmorrowsDate, setOvermorrowsDate] = React.useState<Date>(
        getDateInXDays(2)
    )

    useEffect(() => {
        setTomorrowsDate(getDateInXDays(1))
        setOvermorrowsDate(getDateInXDays(2))
    }, [todaysDate, setTomorrowsDate, setOvermorrowsDate])

    return (
        <MediumCard>
            <Grid container spacing={1} height={'100%'}>
                <Grid item xs={6}>
                    <Box>
                        <Typography variant="body1">TODAY</Typography>
                        <Stack spacing={1} direction={'column'}>
                            <EventsOnDay
                                date={todaysDate}
                                maxEvents={2}
                                eventTexts={TodayEventTexts}
                            />
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Grid
                        container
                        direction="column"
                        spacing={1}
                        height={'100%'}
                    >
                        <Grid item xs={6} height={'50%'}>
                            <Typography
                                fontWeight={'bold'}
                                fontSize={xSmallFontSize}
                            >
                                TOMORROW
                            </Typography>
                            <Stack direction={'column'}>
                                <EventsOnDay
                                    date={tomorrowsDate}
                                    maxEvents={1}
                                    eventTexts={NextDaysEventTexts}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={6} height={'50%'}>
                            <Typography
                                fontWeight={'bold'}
                                fontSize={xSmallFontSize}
                            >
                                OVERMORROW
                            </Typography>
                            <Stack direction={'column'}>
                                <EventsOnDay
                                    date={overmorrowsDate}
                                    maxEvents={1}
                                    eventTexts={NextDaysEventTexts}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </MediumCard>
    )
}

const EventsOnDay = ({
    date,
    maxEvents,
    eventTexts,
}: {
    date: Date
    maxEvents: number
    eventTexts: EventTexts
}): ReactElement | ReactElement[] => {
    const {
        data: events,
        isLoading,
        error,
    } = useGetEvents([
        {
            name: 'minTime',
            value: encodeURIComponent(getISODayStartString(date, true)),
        },
        {
            name: 'maxTime',
            value: encodeURIComponent(getISODayEndString(date, true)),
        },
    ])

    if (isLoading) {
        return (
            <React.Fragment>
                {Array.from({ length: maxEvents }, (_, index) => (
                    <Skeleton key={index} variant="rounded" />
                ))}
            </React.Fragment>
        )
    } else if (error) {
        return <NoEventsItem timeFrame={'Error while loading events'} />
    } else if (events === undefined || events.count === 0) {
        return <NoEventsItem timeFrame={eventTexts.noEvents} />
    } else if (events.count <= maxEvents) {
        return events.list.map((ev) => (
            <Event item={ev} date={date} key={ev.start} />
        ))
    }

    const summary = eventTexts.manyEvents.replace(
        '{{X}}',
        `${events.count - (maxEvents - 1)}`
    )
    const summaryEventList = events.list.slice(maxEvents - 1)
    const eventItem: EventItem = {
        summary,
        description: '',
        start: summaryEventList[0].start,
        end: getMaxDateEndDate(summaryEventList).toISOString(),
        location: '',
        allDay: summaryEventList.some((ev) => ev.allDay),
        multiDays: summaryEventList.some((ev) => ev.multiDays),
        merged: true,
    }
    const displayEventList = events.list.slice(0, maxEvents - 1)

    return (
        <React.Fragment>
            {displayEventList.map((ev) => (
                <Event item={ev} date={date} key={ev.summary} />
            ))}
            <Event item={eventItem} date={date} key={eventItem.start} />
        </React.Fragment>
    )
}

const getMaxDateEndDate = (events: Array<EventItem>): Date => {
    const endDates = events.map((item) => new Date(item.end).getTime())
    return new Date(Math.max(...endDates))
}

const NoEventsItem = ({ timeFrame }: { timeFrame: string }): ReactElement => {
    return (
        <Typography color="text.secondary" sx={xSmallFontSize}>
            {timeFrame}
        </Typography>
    )
}

export default UpcomingEvents
