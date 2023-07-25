import { EParamType } from "services/validators/parameter_validator";
import { RangeParameterValidator } from "services/validators/range_parameter_validator";

export const eventCountMiddleware = new RangeParameterValidator(
  "count",
  { min: 1, max: 100 },
  EParamType.query,
  false,
);
