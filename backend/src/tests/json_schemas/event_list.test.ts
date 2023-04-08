export const event_list_schema = {
    "definitions": {},
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Root",
    "type": "object",
    "required": [
        "count",
        "list"
    ],
    "properties": {
        "count": {
            "$id": "#root/count",
            "title": "Count",
            "type": "integer",
            "default": 0
        },
        "list": {
            "$id": "#root/list",
            "title": "List",
            "type": "array",
            "default": [],
            "items": {
                "$id": "#root/list/items",
                "title": "Items",
                "type": "object",
                "required": [
                    "kind",
                    "etag",
                    "id",
                    "status",
                    "start",
                    "end",
                ],
                "properties": {
                    "kind": {
                        "$id": "#root/list/items/kind",
                        "title": "Kind",
                        "type": "string",
                        "default": "",
                        "pattern": "^.*$"
                    },
                    "etag": {
                        "$id": "#root/list/items/etag",
                        "title": "Etag",
                        "type": "string",
                        "default": "",
                        "pattern": "^.*$"
                    },
                    "id": {
                        "$id": "#root/list/items/id",
                        "title": "Id",
                        "type": "string",
                        "default": "",
                        "pattern": "^.*$"
                    },
                    "status": {
                        "$id": "#root/list/items/status",
                        "title": "Status",
                        "type": "string",
                        "default": "",
                        "pattern": "^.*$"
                    },
                    "htmlLink": {
                        "$id": "#root/list/items/htmlLink",
                        "title": "Htmllink",
                        "type": "string",
                        "default": "",
                        "pattern": "^.*$"
                    },
                    "created": {
                        "$id": "#root/list/items/created",
                        "title": "Created",
                        "type": "string",
                        "default": "",
                        "pattern": "^.*$"
                    },
                    "updated": {
                        "$id": "#root/list/items/updated",
                        "title": "Updated",
                        "type": "string",
                        "default": "",
                        "pattern": "^.*$"
                    },
                    "summary": {
                        "$id": "#root/list/items/summary",
                        "title": "Summary",
                        "type": "string",
                        "default": "",
                        "pattern": "^.*$"
                    },
                    "description": {
                        "$id": "#root/list/items/description",
                        "title": "Description",
                        "type": "string"
                    },
                    "location": {
                        "$id": "#root/list/items/location",
                        "title": "Location",
                        "type": "string",
                        "default": "",
                        "pattern": "^.*$"
                    },
                    "creator": {
                        "$id": "#root/list/items/creator",
                        "title": "Creator",
                        "type": "object",
                        "required": [

                        ],
                        "properties": {
                            "email": {
                                "$id": "#root/list/items/creator/email",
                                "title": "Email",
                                "type": "string"
                            },
                            "self": {
                                "$id": "#root/list/items/creator/self",
                                "type": "boolean"
                            }
                        }
                    },
                    "organizer": {
                        "$id": "#root/list/items/organizer",
                        "title": "Organizer",
                        "type": "object",
                        "required": [
                            "email"
                        ],
                        "properties": {
                            "email": {
                                "$id": "#root/list/items/organizer/email",
                                "title": "Email",
                                "type": "string",
                                "default": "",
                                "pattern": "^.*$"
                            },
                            "self": {
                                "$id": "#root/list/items/organizer/self",
                                "title": "Self",
                                "type": "boolean",
                                "default": true
                            }
                        }
                    },
                    "start": {
                        "$id": "#root/list/items/start",
                        "title": "Start",
                        "type": "object",
                        "required": [

                        ],
                        "properties": {
                            "dateTime": {
                                "$id": "#root/list/items/start/dateTime",
                                "title": "Datetime",
                                "type": "string",
                                "default": "",
                                "pattern": "^.*$"
                            },
                            "date": {
                                "$id": "#root/list/items/start/date",
                                "title": "Date",
                                "type": "string",
                                "default": "",
                                "pattern": "^.*$"
                            },
                            "timeZone": {
                                "$id": "#root/list/items/start/timeZone",
                                "title": "Timezone",
                                "type": "string",
                                "default": "",
                                "pattern": "^.*$"
                            }
                        }
                    },
                    "end": {
                        "$id": "#root/list/items/end",
                        "title": "End",
                        "type": "object",
                        "required": [

                        ],
                        "properties": {
                            "dateTime": {
                                "$id": "#root/list/items/end/dateTime",
                                "title": "Datetime",
                                "type": "string",
                                "default": "",
                                "pattern": "^.*$"
                            },
                            "date": {
                                "$id": "#root/list/items/end/date",
                                "title": "Date",
                                "type": "string",
                                "default": "",
                                "pattern": "^.*$"
                            },
                            "timeZone": {
                                "$id": "#root/list/items/end/timeZone",
                                "title": "Timezone",
                                "type": "string",
                                "default": "",
                                "pattern": "^.*$"
                            }
                        }
                    },
                    "iCalUID": {
                        "$id": "#root/list/items/iCalUID",
                        "title": "Icaluid",
                        "type": "string",
                        "default": "",
                        "pattern": "^.*$"
                    },
                    "sequence": {
                        "$id": "#root/list/items/sequence",
                        "title": "Sequence",
                        "type": "integer",
                        "default": 0
                    },
                    "reminders": {
                        "$id": "#root/list/items/reminders",
                        "title": "Reminders",
                        "type": "object",
                        "required": [
                            "useDefault"
                        ],
                        "properties": {
                            "useDefault": {
                                "$id": "#root/list/items/reminders/useDefault",
                                "title": "Usedefault",
                                "type": "boolean",
                                "default": true
                            }
                        }
                    },
                    "eventType": {
                        "$id": "#root/list/items/eventType",
                        "title": "Eventtype",
                        "type": "string",
                        "default": "",
                        "pattern": "^.*$"
                    }
                }
            }
        }
    }
}