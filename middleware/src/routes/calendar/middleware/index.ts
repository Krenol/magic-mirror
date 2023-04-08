import { isIso8601DatetimeString } from "services/dateParser";
import { CustomQueryParameterValidator } from "services/validators/custom_query_parameter_validator";
import { RangeQueryParameterValidator } from "services/validators/range_query_parameter_validator";

const eventCountMiddleware = new RangeQueryParameterValidator('count', { min: 1, max: 100 }, false);

const minTimeMiddleware = new CustomQueryParameterValidator('minTime', isIso8601DatetimeString, false);

const maxTimeMiddleware = new CustomQueryParameterValidator('maxTime', isIso8601DatetimeString, false);

export const allEventsMw = [eventCountMiddleware.validate, minTimeMiddleware.validate, maxTimeMiddleware.validate]