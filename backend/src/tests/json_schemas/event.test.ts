export const event_schema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  properties: {
    kind: {
      type: "string",
    },
    etag: {
      type: "string",
    },
    id: {
      type: "string",
    },
    status: {
      type: "string",
    },
    htmlLink: {
      type: "string",
    },
    created: {
      type: "string",
    },
    updated: {
      type: "string",
    },
    summary: {
      type: "string",
    },
    location: {
      type: "string",
    },
    creator: {
      type: "object",
      properties: {
        email: {
          type: "string",
        },
        self: {
          type: "boolean",
        },
      },
      required: ["email"],
    },
    organizer: {
      type: "object",
      properties: {
        email: {
          type: "string",
        },
        self: {
          type: "boolean",
        },
      },
      required: ["email"],
    },
    start: {
      type: "object",
      properties: {
        dateTime: {
          type: "string",
        },
        timeZone: {
          type: "string",
        },
      },
      required: ["dateTime", "timeZone"],
    },
    end: {
      type: "object",
      properties: {
        dateTime: {
          type: "string",
        },
        timeZone: {
          type: "string",
        },
      },
      required: ["dateTime", "timeZone"],
    },
    iCalUID: {
      type: "string",
    },
    sequence: {
      type: "integer",
    },
    attendees: {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            email: {
              type: "string",
            },
            responseStatus: {
              type: "string",
            },
          },
          required: ["email", "responseStatus"],
        },
        {
          type: "object",
          properties: {
            email: {
              type: "string",
            },
            organizer: {
              type: "boolean",
            },
            self: {
              type: "boolean",
            },
            responseStatus: {
              type: "string",
            },
          },
          required: ["email", "organizer", "responseStatus"],
        },
      ],
    },
    reminders: {
      type: "object",
      properties: {
        useDefault: {
          type: "boolean",
        },
      },
      required: ["useDefault"],
    },
    eventType: {
      type: "string",
    },
  },
  required: [
    "kind",
    "etag",
    "id",
    "location",
    "creator",
    "organizer",
    "start",
    "end",
    "iCalUID",
  ],
};
