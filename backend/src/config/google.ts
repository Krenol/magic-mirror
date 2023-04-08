export const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER
export const SCOPES = ['email', 'profile', 'https://www.googleapis.com/auth/calendar.readonly'];
export const GOOGLE_OAUTH_API_HOST = 'https://oauth2.googleapis.com'
export const GOOGLE_API_HOST = 'https://www.googleapis.com'
export const GOOGLE_API_VERSION = 'v3'
export const GOOGLE_CALENDAR_ENDPOINT = `${GOOGLE_API_HOST}/calendar/${GOOGLE_API_VERSION}/calendars`
export const GOOGLE_TOKENINFO_ENDPOINT = `${GOOGLE_OAUTH_API_HOST}/tokeninfo`

export const OAUTH2_CLIENT = {
    CLIENT_ID: process.env.CLIENT_ID || "undefined",
    CLIENT_SECRET: process.env.CLIENT_SECRET || "undefined",
}

export const CALENDAR_CONFIG = {
    BIRTHDAY_ID: 'addressbook#contacts@group.v.calendar.google.com',
    DEFAULT_EVENT_COUNT: 100
}
