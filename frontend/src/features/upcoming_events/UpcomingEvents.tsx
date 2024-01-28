import Typography from "@mui/material/Typography";
import { Box, Grid, Stack } from "@mui/material";
import { MediumCard } from "../CardFrame";
import { EventList, EventItem } from "../../models/calendar";
import { Event } from "./event/Event";
import { xSmallFontSize } from "../../assets/styles/theme";
import React, { ReactElement } from "react";
import { GetUpcomingEvents } from "./GetUpcomingEvents";
import { EventTextEnum } from "./types";

const UpcomingEvents = () => {
  const upcomingEvents = GetUpcomingEvents();

  const todaysEventItems = GetTodaysEventItems(
    upcomingEvents.todayEvents,
    upcomingEvents.dates.today
  );

  const tmrwsEventItems = GetFutureEventItems(
    upcomingEvents.tmrwEvents,
    upcomingEvents.dates.tmrw
  );

  const overmrwsEventItems = GetFutureEventItems(
    upcomingEvents.overmrwEvents,
    upcomingEvents.dates.overmrw
  );

  const boxContent = (
    <Box>
      <Typography variant="body1">TODAY</Typography>
      <Stack spacing={1} direction={"column"}>
        {todaysEventItems}
      </Stack>
    </Box>
  );

  const cardContent = (
    <Grid direction="column" spacing={1} height={"100%"}>
      <Grid item xs={6} height={"50%"}>
        <Typography fontWeight={"bold"} fontSize={xSmallFontSize}>
          TOMORROW
        </Typography>
        <Stack direction={"column"}>{tmrwsEventItems}</Stack>
      </Grid>
      <Grid item xs={6} height={"50%"}>
        <Typography fontWeight={"bold"} fontSize={xSmallFontSize}>
          OVERMORROW
        </Typography>
        <Stack direction={"column"}>{overmrwsEventItems}</Stack>
      </Grid>
    </Grid>
  );

  if (upcomingEvents.loading) {
    return <MediumCard>Loading...</MediumCard>;
  }

  if (upcomingEvents.errors.filter(Boolean).length > 0) {
    return <MediumCard>Error!</MediumCard>;
  }

  return (
    <MediumCard>
      <Grid container spacing={1} height={"100%"}>
        <Grid item xs={6}>
          {boxContent}
        </Grid>
        <Grid item xs={6}>
          {cardContent}
        </Grid>
      </Grid>
    </MediumCard>
  );
};

const GetTodaysEventItems = (
  events: EventList | undefined,
  date: Date
): ReactElement | ReactElement[] => {
  const eventCount = events?.count ?? 0;
  if (eventCount === 0) return NoEventsItem(EventTextEnum.noEventsToday);
  if (eventCount <= 2)
    return events!.list.map((ev) => (
      <Event item={ev} date={date} key={ev.start} />
    ));
  const summary = EventTextEnum.manyToday.replace("{{X}}", `${eventCount - 1}`);
  const eventItem: EventItem = {
    summary,
    description: "",
    start: events!.list[1].start,
    end: events!.list[eventCount - 1].end,
    location: "",
    allDay: false,
    multiDays: false,
    merged: true,
  };
  return (
    <React.Fragment>
      <Event item={events!.list[0]} date={date} key={events!.list[0].start} />
      <Event item={eventItem} date={date} key={eventItem.start} />
    </React.Fragment>
  );
};

const GetFutureEventItems = (
  events: EventList | undefined,
  date: Date
): ReactElement => {
  const eventCount = events?.count ?? 0;
  if (eventCount === 0) return NoEventsItem(EventTextEnum.noEvents);
  if (eventCount === 1)
    return (
      <Event item={events!.list[0]} date={date} key={events!.list[0].start} />
    );
  const summary = EventTextEnum.many.replace("{{X}}", `${eventCount}`);
  const eventItem: EventItem = {
    summary,
    description: "",
    start: events!.list[0].start,
    end: getMaxDateEndDate(events!).toISOString(),
    location: "",
    allDay: events!.list.some((ev) => ev.allDay),
    multiDays: events!.list.some((ev) => ev.multiDays),
    merged: true,
  };
  return <Event item={eventItem} date={date} key={eventItem.start} />;
};

const getMaxDateEndDate = (events: EventList): Date => {
  const endDates = events.list.map((item) => new Date(item.end).getTime());
  return new Date(Math.max(...endDates));
};

const NoEventsItem = (timeFrame: EventTextEnum): ReactElement => {
  return (
    <Typography color="text.secondary" sx={xSmallFontSize}>
      {timeFrame}
    </Typography>
  );
};

export default UpcomingEvents;
