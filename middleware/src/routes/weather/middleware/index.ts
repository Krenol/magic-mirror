import { MAX_FORECAST_DAYS, MAX_HOURLY_FORECAST_HOURS } from "config/openmeteo_api";
import { EParamType } from "services/validators/parameter_validator";
import { RangeParameterValidator } from "services/validators/range_parameter_validator";
import { RegexParameterValidator } from "services/validators/regex_parameter_validator";


const GPS_COORD_REGEX = RegExp('^\\d{1,3}.\\d+$');

const latitudeMiddleware = new RegexParameterValidator('latitude', GPS_COORD_REGEX, EParamType.query, true);
const longitudeMiddleware = new RegexParameterValidator('longitude', GPS_COORD_REGEX, EParamType.query, true);
const hourlyQryMiddleware = new RangeParameterValidator('hours', { min: 1, max: MAX_HOURLY_FORECAST_HOURS }, EParamType.query, false);
const daysQryMiddleware = new RangeParameterValidator('days', { min: 1, max: MAX_FORECAST_DAYS }, EParamType.query, false);

export const currentMw = [latitudeMiddleware.validate, longitudeMiddleware.validate];
export const hourlyMw = [hourlyQryMiddleware.validate, latitudeMiddleware.validate, longitudeMiddleware.validate];
export const daysMw = [daysQryMiddleware.validate, latitudeMiddleware.validate, longitudeMiddleware.validate];
