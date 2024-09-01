import { EParamType } from 'services/validators/parameter_validator';
import { RangeParameterValidator } from 'services/validators/range_parameter_validator';

const taskCountMiddleware = new RangeParameterValidator('count', { min: 1, max: 100 }, EParamType.query, false);

export { taskCountMiddleware };
