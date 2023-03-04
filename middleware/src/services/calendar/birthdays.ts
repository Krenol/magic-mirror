import { GcalApiEventList } from "../../models/calendar";
import { Birthday, BirthdayList, GcalApiBirthdayEventResource } from "../../models/birthdays";
import { getAccessToken } from "../user";
import { CALENDAR_CONFIG } from "../../config/google";
import { User } from "../../models/user";
import { getEvents } from "./events";

export const getBirthdayEvents = async (user: User, maxResults: number = CALENDAR_CONFIG.DEFAULT_EVENT_COUNT, orderBy = 'startTime'): Promise<GcalApiEventList> => {
    const access_token = await getAccessToken(user);
    const calendarID = encodeURIComponent(CALENDAR_CONFIG.BIRTHDAY_ID);
    return getEvents(calendarID, access_token, maxResults, orderBy);
}

export const parseRetrievedBirthdays = async (events: GcalApiEventList): Promise<BirthdayList> => {
    return {
        count: events.items.length,
        iconLink: events.items.length ? events.items[0].gadget.iconLink : "",
        list: await parseBirthdays(events.items as Array<GcalApiBirthdayEventResource>)
    };
}

const parseBirthdays = async (birthdaysList: Array<GcalApiBirthdayEventResource>): Promise<Array<Birthday>> => {
    const bdays: Array<Promise<Birthday>> = [];
    birthdaysList
        .filter(b => b.gadget.preferences['goo.contactsEventType'].toUpperCase() === 'BIRTHDAY')
        .forEach(b => bdays.push(parseBirthday(b)));
    return Promise.all(bdays);
}

const parseBirthday = async (birthday: GcalApiBirthdayEventResource): Promise<Birthday> => {
    return {
        name: birthday.gadget.preferences['goo.contactsFullName'],
        date: birthday.start.date
    }
}