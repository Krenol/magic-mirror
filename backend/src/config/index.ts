import { IDatabaseConenction } from "services/database/database";
import { StrategyOptionsWithRequest } from "passport-google-oauth20";
import { randomUUID } from "crypto";

export const SERVER_PORT = parseInt(process.env.PORT ?? String(3001));
export const SESSION_SECRET = process.env.SESSION_SECRET ?? randomUUID();
export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME ?? "localhost";
export const PROXY_SERVER_HOSTNAME =
  process.env.PROXY_SERVER_HOSTNAME ?? SERVER_HOSTNAME;
export const PROXY_SERVER_PORT = process.env.PROXY_SERVER_PORT ?? SERVER_PORT;
export const PROXY_SERVER_CONTEXT = process.env.PROXY_SERVER_CONTEXT ?? "/api";
export const PROXY_SERVER_PROTOCOL =
  process.env.PROXY_SERVER_PROTOCOL ?? "https";
export const ENABLE_HTTPS =
  (process.env.ENABLE_HTTPS?.toLowerCase() ?? "false") === "true";
export const SSL_PRIVATE_KEY =
  process.env.SSL_PRIVATE_KEY ?? "/etc/express/express.key";
export const SSL_CERTIFICATE =
  process.env.SSL_PRIVATE_KEY ?? "/etc/express/express.pem";

export const mongoDbData: IDatabaseConenction = {
  hostname: process.env.MONGO_HOSTNAME ?? "mongo",
  port: parseInt(process.env.MONGO_PORT ?? "27017"),
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
  database: process.env.MONGO_DATABASE,
  options: [
    {
      name: "authSource",
      value: "admin",
    },
    {
      name: "ssl",
      value: process.env.MONGO_SSL ?? "false",
    },
  ],
};

export const SCOPES = [
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar.readonly",
];
export const GOOGLE_OAUTH_API_HOST = "https://oauth2.googleapis.com";
export const GOOGLE_API_HOST = "https://www.googleapis.com";
export const GOOGLE_API_VERSION = "v3";
export const GOOGLE_CALENDAR_ENDPOINT = `${GOOGLE_API_HOST}/calendar/${GOOGLE_API_VERSION}/calendars`;
export const GOOGLE_TOKENINFO_ENDPOINT = `${GOOGLE_OAUTH_API_HOST}/tokeninfo`;
export const GOOGLE_USER_INFO_ENDPOINT = `${GOOGLE_API_HOST}/oauth2/v1/userinfo`;

export const OAUTH2_CLIENT = {
  CLIENT_ID: process.env.CLIENT_ID ?? "undefined",
  CLIENT_SECRET: process.env.CLIENT_SECRET ?? "undefined",
};

export const CALENDAR_CONFIG = {
  BIRTHDAY_ID: "addressbook#contacts@group.v.calendar.google.com",
  DEFAULT_EVENT_COUNT: 100,
};

export const OPENWEATHER_URL = "https://openweathermap.org";
export const GEOCODE_URL = "https://geocode.maps.co";
export const WEATHER_API_URL = "https://api.open-meteo.com/v1";
export const WEATHER_UNITS = {
  timezone: "GMT%2B0",
  temperature_unit: "celsius",
  windspeed_unit: "kmh",
  precipitation_unit: "mm",
  timeformat: "iso8601",
};
export const STD_API_QUERY = Object.entries(WEATHER_UNITS)
  .join("&")
  .replace(/,/g, "=");
export const WEATHER_ICON_URL = "https://openweathermap.org";
export const MAX_FORECAST_DAYS = 9;
export const FORECAST_FIELDS =
  "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,weathercode,sunrise,sunset";
export const MAX_HOURLY_FORECAST_HOURS = 24;

export const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost";
export const REDIRECT_URI = process.env.REDIRECT_URI ?? `${FRONTEND_URL}/`;
export const REGISTER_REDIRECT_URI =
  process.env.REGISTER_REDIRECT_URI ?? `${FRONTEND_URL}/registration`;
export const FAILURE_REDIRECT_URI =
  process.env.FAILURE_REDIRECT_URI ?? `${FRONTEND_URL}/login`;
export const GOOGLE_LOGIN_CALLBACK_CONTEXT =
  process.env.GOOGLE_LOGIN_CALLBACK_CONTEXT ?? "/auth/login/callback";
export const GOOGLE_REGISTER_CALLBACK_CONTEXT =
  process.env.GOOGLE_REGISTER_CALLBACK_CONTEXT ?? "/auth/register/callback";
export const GOOGLE_LOGIN_STRATEGY_OPTIONS: StrategyOptionsWithRequest = {
  clientID: OAUTH2_CLIENT.CLIENT_ID,
  clientSecret: OAUTH2_CLIENT.CLIENT_SECRET,
  callbackURL: `${PROXY_SERVER_PROTOCOL}://${PROXY_SERVER_HOSTNAME}:${PROXY_SERVER_PORT}${PROXY_SERVER_CONTEXT}/${GOOGLE_LOGIN_CALLBACK_CONTEXT.replace(
    /^\/(.*)$/,
    "$1"
  )}`,
  passReqToCallback: true,
};
export const GOOGLE_REGISTER_STRATEGY_OPTIONS: StrategyOptionsWithRequest = {
  clientID: OAUTH2_CLIENT.CLIENT_ID,
  clientSecret: OAUTH2_CLIENT.CLIENT_SECRET,
  callbackURL: `${PROXY_SERVER_PROTOCOL}://${PROXY_SERVER_HOSTNAME}:${PROXY_SERVER_PORT}${PROXY_SERVER_CONTEXT}/${GOOGLE_REGISTER_CALLBACK_CONTEXT.replace(
    /^\/(.*)$/,
    "$1"
  )}`,
  passReqToCallback: true,
};
export const ALLOWED_USERS: Array<string> = JSON.parse(
  process.env.ALLOWED_USER_EMAILS ?? "[]"
);

export const LOGIN_STRATEGY_NAME = "google-login";
export const REGISTER_STRATEGY_NAME = "google-register";

export const ALLOWED_URLS = [
  GOOGLE_API_HOST,
  GOOGLE_OAUTH_API_HOST,
  WEATHER_API_URL,
  OPENWEATHER_URL,
  GEOCODE_URL,
];

export const RATE_LIMIT = {
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 500,
};
