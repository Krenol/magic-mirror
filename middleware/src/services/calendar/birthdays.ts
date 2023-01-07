import { gcal_api_event_list } from "../../models/calendar";
import { birthday, birthdays_list, gcal_api_birthday_event_resource } from "../../models/birthdays";

export const parseRetrievedBirthdays = async (events: gcal_api_event_list): Promise<birthdays_list> => {
    return {
        count: events.items.length,
        iconLink: events.items.length ? events.items[0].gadget.iconLink : "",
        list: await parseBirthdays(events.items as Array<gcal_api_birthday_event_resource>)
    };
}

const parseBirthdays = async (birthdaysList: Array<gcal_api_birthday_event_resource>): Promise<Array<birthday>> => {
    const birthdays: Array<Promise<birthday>> = [];
    birthdaysList.forEach(b => birthdays.push(parseBirthday(b)));
    return Promise.all(birthdays);
}

const parseBirthday = async (birthday: gcal_api_birthday_event_resource): Promise<birthday> => {
    return {
        name: birthday.gadget.preferences['goo.contactsFullName'],
        date: birthday.start.date
    }
}