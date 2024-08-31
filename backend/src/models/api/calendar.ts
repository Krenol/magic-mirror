export type EventRequestParams = {
  maxResults: number;
  minTime: string;
  maxTime?: string;
};

export type EventList = {
  count: number;
  list: Array<EventItem>;
};

export type EventItem = {
  summary: string;
  description: string;
  location: string;
  start: string;
  end: string;
  allDay: boolean;
  multiDays: boolean;
};
