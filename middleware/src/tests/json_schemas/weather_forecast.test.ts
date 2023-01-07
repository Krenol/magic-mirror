export const weather_forecast_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "latitude": {
            "type": "number"
        },
        "longitude": {
            "type": "number"
        },
        "days": {
            "type": "integer"
        },
        "forecast": {
            "type": "array",
            "items": [
                {
                    "type": "object",
                    "properties": {
                        "date": {
                            "type": "string"
                        },
                        "temperature": {
                            "type": "object",
                            "properties": {
                                "min": {
                                    "type": "number"
                                },
                                "max": {
                                    "type": "number"
                                },
                                "unit": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "min",
                                "max",
                                "unit"
                            ]
                        },
                        "precipitation": {
                            "type": "object",
                            "properties": {
                                "amount": {
                                    "type": ["integer", "number"]
                                },
                                "hours": {
                                    "type": "integer"
                                },
                                "amount_unit": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "amount",
                                "hours",
                                "amount_unit"
                            ]
                        },
                        "weather_icon": {
                            "type": "string"
                        },
                        "sunrise": {
                            "type": "string"
                        },
                        "sunset": {
                            "type": "string"
                        },
                        "weathercode": {
                            "type": "integer"
                        },
                        "description": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "date",
                        "temperature",
                        "precipitation",
                        "weather_icon",
                        "sunrise",
                        "sunset",
                        "weathercode",
                        "description"
                    ]
                },
                {
                    "type": "object",
                    "properties": {
                        "date": {
                            "type": "string"
                        },
                        "temperature": {
                            "type": "object",
                            "properties": {
                                "min": {
                                    "type": ["integer", "number"]
                                },
                                "max": {
                                    "type": ["integer", "number"]
                                },
                                "unit": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "min",
                                "max",
                                "unit"
                            ]
                        },
                        "precipitation": {
                            "type": "object",
                            "properties": {
                                "amount": {
                                    "type": ["integer", "number"]
                                },
                                "hours": {
                                    "type": "integer"
                                },
                                "amount_unit": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "amount",
                                "hours",
                                "amount_unit"
                            ]
                        },
                        "weather_icon": {
                            "type": "string"
                        },
                        "sunrise": {
                            "type": "string"
                        },
                        "sunset": {
                            "type": "string"
                        },
                        "weathercode": {
                            "type": "integer"
                        },
                        "description": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "date",
                        "temperature",
                        "precipitation",
                        "weather_icon",
                        "sunrise",
                        "sunset",
                        "weathercode",
                        "description"
                    ]
                }
            ]
        }
    },
    "required": [
        "latitude",
        "longitude",
        "days",
        "forecast"
    ]
}