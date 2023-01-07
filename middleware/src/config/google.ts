export const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER
export const SCOPES = ['email', 'profile', 'https://www.googleapis.com/auth/calendar.readonly'];

export const OAUTH2_CLIENT = {
    CLIENT_ID: process.env.CLIENT_ID || "undefined",
    CLIENT_SECRET: process.env.CLIENT_SECRET || "undefined",
}

export const CALENDAR_CONFIG = {
    BIRTHDAY_ID: 'addressbook#contacts@group.v.calendar.google.com',
    DEFAULT_EVENT_COUNT: 100
}
