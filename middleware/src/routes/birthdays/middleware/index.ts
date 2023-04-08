import { RangeQueryParameterValidator } from "services/validators/range_query_parameter_validator";

export const eventCountMiddleware = new RangeQueryParameterValidator('count', { min: 1, max: 100 }, false);