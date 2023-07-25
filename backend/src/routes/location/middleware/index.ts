import { MAX_FORECAST_DAYS, MAX_HOURLY_FORECAST_HOURS } from "config";
import { EParamType } from "services/validators/parameter_validator";
import { RangeParameterValidator } from "services/validators/range_parameter_validator";
import { RegexParameterValidator } from "services/validators/regex_parameter_validator";

const COUNTRY_CODE_REGEX = /^[a-zA-Z]{2}$/;
const ZIP_REGEX = /^\w{1,}$/;
const CITY_REGEX = /^\w{1,}$/;

const countryCodeMiddleware = new RegexParameterValidator(
  "country",
  COUNTRY_CODE_REGEX,
  EParamType.query,
  true
);

const zipCodeMiddleware = new RegexParameterValidator(
  "zip_code",
  ZIP_REGEX,
  EParamType.query,
  false
);

const cityMiddleware = new RegexParameterValidator(
  "city",
  CITY_REGEX,
  EParamType.query,
  false
);

export const geocodeMw = [
  countryCodeMiddleware.validate,
  zipCodeMiddleware.validate,
  cityMiddleware.validate,
];
