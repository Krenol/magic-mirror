export const weather_current_schema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  properties: {
    latitude: {
      type: "number",
    },
    longitude: {
      type: "number",
    },
    temperature: {
      type: "number",
    },
    windspeed: {
      type: "number",
    },
    weathercode: {
      type: "integer",
    },
    update_time: {
      type: "string",
    },
    weather_icon: {
      type: "string",
    },
    description: {
      type: "string",
    },
  },
  required: [
    "latitude",
    "longitude",
    "temperature",
    "windspeed",
    "weathercode",
    "update_time",
    "weather_icon",
    "description",
  ],
};
