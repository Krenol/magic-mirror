import { CALENDAR_CONFIG, GOOGLE_CALENDAR_ENDPOINT } from "config";
import {
  BirthdayList,
  GcalApiBirthdayEventResource,
  Birthday,
} from "models/api/birthdays";
import { EventRequestParams, GcalApiEventList } from "models/api/calendar";
import { fetchJson } from "services/fetch";
import { getAuthenticationHeader } from "services/headers";
import { Request } from "express";

export const getBirthdayEvents = async (
  req: Request,
  params: EventRequestParams,
  orderBy = "startTime"
): Promise<BirthdayList> => {
  const calendarID = encodeURIComponent(CALENDAR_CONFIG.BIRTHDAY_ID);
  const authHeader = await getAuthenticationHeader(req.headers);
  return buildApiUrl(calendarID, params, orderBy)
    .then((url) => fetchJson(url, authHeader))
    .then((data) => data.body as GcalApiEventList)
    .then(parseRetrievedBirthdays)
    .catch((err) => {
      throw err;
    });
};

const buildApiUrl = async (
  calendarId: string,
  params: EventRequestParams,
  orderBy = "startTime"
): Promise<string> => {
  let query = `timeMin=${params.minTime}&maxResults=${params.maxResults}&singleEvents=true&orderBy=${orderBy}`;
  query += params.maxTime ? `&timeMax=${params.maxTime}` : "";
  const url = `${GOOGLE_CALENDAR_ENDPOINT}/${calendarId}/events?${query}`;
  return url;
};

const parseRetrievedBirthdays = async (
  events: GcalApiEventList
): Promise<BirthdayList> => {
  return {
    count: events.items.length,
    iconLink: events.items.length ? events.items[0].gadget.iconLink : "",
    list: await parseBirthdays(
      events.items as Array<GcalApiBirthdayEventResource>
    ),
  };
};

const parseBirthdays = async (
  birthdaysList: Array<GcalApiBirthdayEventResource>
): Promise<Array<Birthday>> => {
  const bdays: Array<Promise<Birthday>> = [];
  birthdaysList
    .filter(
      (b) =>
        b.gadget.preferences["goo.contactsEventType"].toUpperCase() ===
        "BIRTHDAY"
    )
    .forEach((b) => bdays.push(parseBirthday(b)));
  return Promise.all(bdays);
};

const parseBirthday = async (
  birthday: GcalApiBirthdayEventResource
): Promise<Birthday> => {
  return {
    name: birthday.gadget.preferences["goo.contactsFullName"],
    date: birthday.start.date,
  };
};
