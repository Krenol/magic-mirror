import Typography from "@mui/material/Typography";
import { Box, Card } from "@mui/material";
import { cardStyle, columnBoxStyle, parentBoxStyle } from "./style";
import { CardFrame } from "../CardFrame";
import { EventList, EventItem } from "../../models/calendar";
import { Event } from "./event/Event";
import { boldText, xSmallFontSize } from "../../assets/styles/theme";
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
    <Box sx={{ ...columnBoxStyle, ...{ gap: 1 } }}>
      <Typography variant="body1" sx={{ marginBottom: "1px" }}>
        TODAY
      </Typography>
      {todaysEventItems}
    </Box>
  );

  const cardContent = (
    <Box sx={{ marginLeft: "2px" }}>
      <Box sx={{ ...columnBoxStyle, ...{ height: "50%" } }}>
        <Typography sx={{ ...xSmallFontSize, ...boldText }}>
          TOMORROW
        </Typography>
        {tmrwsEventItems}
      </Box>
      <Box sx={{ ...columnBoxStyle, ...{ height: "50%" } }}>
        <Typography sx={{ ...xSmallFontSize, ...boldText }}>
          OVERMORROW
        </Typography>
        {overmrwsEventItems}
      </Box>
    </Box>
  );

  if (upcomingEvents.loading) {
    return (
      <CardFrame
        boxContent={"Loading..."}
        cardStyle={cardStyle}
        parentBoxStyle={parentBoxStyle}
      />
    );
  }

  if (upcomingEvents.errors.filter(Boolean).length > 0) {
    return (
      <CardFrame
        boxContent={"Error!"}
        cardStyle={cardStyle}
        parentBoxStyle={parentBoxStyle}
      />
    );
  }

  return (
    <Card sx={cardStyle}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        {boxContent}
        {cardContent}
      </Box>
    </Card>
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
