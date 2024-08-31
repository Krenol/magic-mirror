import { EParamType } from 'services/validators/parameter_validator';
import { RegexParameterValidator } from 'services/validators/regex_parameter_validator';

const COUNTRY_CODE_REGEX = /^[a-zA-Z]{2}$/;
const ZIP_REGEX = /^\w+$/;
const CITY_REGEX = /^\w+$/;

const countryCodeMiddleware = new RegexParameterValidator('country', COUNTRY_CODE_REGEX, EParamType.query, true);

const zipCodeMiddleware = new RegexParameterValidator('zip_code', ZIP_REGEX, EParamType.query, false);

const cityMiddleware = new RegexParameterValidator('city', CITY_REGEX, EParamType.query, false);

export const geocodeMw = [countryCodeMiddleware.validate, zipCodeMiddleware.validate, cityMiddleware.validate];
