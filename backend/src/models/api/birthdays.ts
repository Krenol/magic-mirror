import { GcalApiEventResource } from "models/api/calendar";

export type BirthdayList = {
    count: number,
    iconLink: string,
    list: Array<Birthday>
}

export type Birthday = {
    name: string,
    date: string,
}

export interface GcalApiBirthdayEventResource extends GcalApiEventResource {
    gadget: {
        type: string,
        title: string,
        link: string,
        iconLink: string,
        width: number,
        height: number,
        display: string,
        preferences: {
            "goo.contactsGivenName": string,
            "goo.contactsEventType": string,
            "goo.contactsEmail": string,
            "goo.contactsProfileId": string,
            "goo.contactsFullName": string,
            "goo.isGPlusUser": string,
            "goo.contactsContactId": string,
            "goo.contactsIsMyContact": string
        }
    }
}
