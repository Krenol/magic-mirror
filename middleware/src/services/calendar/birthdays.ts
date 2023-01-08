import { GcalApiEventList } from "../../models/calendar";
import { Birthday, BirthdayList, GcalApiBirthdayEventResource } from "../../models/birthdays";

export const parseRetrievedBirthdays = async (events: GcalApiEventList): Promise<BirthdayList> => {
    return {
        count: events.items.length,
        iconLink: events.items.length ? events.items[0].gadget.iconLink : "",
        list: await parseBirthdays(events.items as Array<GcalApiBirthdayEventResource>)
    };
}

const parseBirthdays = async (BirthdaysList: Array<GcalApiBirthdayEventResource>): Promise<Array<Birthday>> => {
    const Birthdays: Array<Promise<Birthday>> = [];
    BirthdaysList.forEach(b => Birthdays.push(parseBirthday(b)));
    return Promise.all(Birthdays);
}

const parseBirthday = async (Birthday: GcalApiBirthdayEventResource): Promise<Birthday> => {
    return {
        name: Birthday.gadget.preferences['goo.contactsFullName'],
        date: Birthday.start.date
    }
}