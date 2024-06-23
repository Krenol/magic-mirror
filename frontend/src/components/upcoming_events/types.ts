export type EventTexts = {
  noEvents: string;
  manyEvents: string;
};

export const TodayEventTexts: EventTexts = {
  noEvents: "No more events today",
  manyEvents: "{{X}} more events",
};

export const NextDaysEventTexts: EventTexts = {
  noEvents: "No events",
  manyEvents: "{{X}} events",
};
