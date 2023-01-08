import { gcal_api_event_resource } from "./calendar";

export type birthday_list = {
    count: number,
    iconLink: string,
    list: Array<birthday>
}

export type birthday = {
    name: string,
    date: string,
}

export interface gcal_api_birthday_event_resource extends gcal_api_event_resource {
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

// export type gcal_api_birthday_event_resource = {
//     kind: string,
//     etag: string,
//     id: string,
//     status: string,
//     htmlLink: string,
//     created: string,
//     updated: string,
//     summary: string,
//     description: string,
//     location: string,
//     colorId: string,
//     creator: {
//         id: string,
//         email: string,
//         displayName: string,
//         self: boolean
//     },
//     organizer: {
//         id: string,
//         email: string,
//         displayName: string,
//         self: boolean
//     },
//     start: {
//         date: string,
//         dateTime: string,
//         timeZone: string
//     },
//     end: {
//         date: string,
//         dateTime: string,
//         timeZone: string
//     },
//     endTimeUnspecified: boolean,
//     recurrence: [
//         string
//     ],
//     recurringEventId: string,
//     originalStartTime: {
//         date: string,
//         dateTime: string,
//         timeZone: string
//     },
//     transparency: string,
//     visibility: string,
//     iCalUID: string,
//     sequence: number,
//     attendees: [
//         {
//             id: string,
//             email: string,
//             displayName: string,
//             organizer: boolean,
//             self: boolean,
//             resource: boolean,
//             optional: boolean,
//             responseStatus: string,
//             comment: string,
//             additionalGuests: number
//         }
//     ],
//     attendeesOmitted: boolean,
//     extendedProperties: {
//         private: object,
//         shared: object
//     },
//     hangoutLink: string,
//     conferenceData: {
//         createRequest: {
//             requestId: string,
//             conferenceSolutionKey: {
//                 type: string
//             },
//             status: {
//                 statusCode: string
//             }
//         },
//         entryPoints: [
//             {
//                 entryPointType: string,
//                 uri: string,
//                 label: string,
//                 pin: string,
//                 accessCode: string,
//                 meetingCode: string,
//                 passcode: string,
//                 password: string
//             }
//         ],
//         conferenceSolution: {
//             key: {
//                 type: string
//             },
//             name: string,
//             iconUri: string
//         },
//         conferenceId: string,
//         signature: string,
//         notes: string,
//     },
//     gadget: {
//         type: string,
//         title: string,
//         link: string,
//         iconLink: string,
//         width: number,
//         height: number,
//         display: string,
//         preferences: {
//             "goo.contactsGivenName": string,
//             "goo.contactsEventType": string,
//             "goo.contactsEmail": string,
//             "goo.contactsProfileId": string,
//             "goo.contactsFullName": string,
//             "goo.isGPlusUser": string,
//             "goo.contactsContactId": string,
//             "goo.contactsIsMyContact": string
//         }
//     },
//     anyoneCanAddSelf: boolean,
//     guestsCanInviteOthers: boolean,
//     guestsCanModify: boolean,
//     guestsCanSeeOtherGuests: boolean,
//     privateCopy: boolean,
//     locked: boolean,
//     reminders: {
//         useDefault: boolean,
//         overrides: [
//             {
//                 method: string,
//                 minutes: number
//             }
//         ]
//     },
//     source: {
//         url: string,
//         title: string
//     },
//     attachments: [
//         {
//             fileUrl: string,
//             title: string,
//             mimeType: string,
//             iconLink: string,
//             fileId: string
//         }
//     ],
//     eventType: string
// }