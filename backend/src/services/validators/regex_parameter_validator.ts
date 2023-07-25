import { Request, Response, NextFunction } from "express";
import {
  ParameterValidator,
  EParamType,
} from "services/validators/parameter_validator";
import { LOGGER } from "services/loggers";
import { ApiError } from "models/api/api_error";

export class RegexParameterValidator extends ParameterValidator {
  private readonly _validationRegex: RegExp;

  constructor(
    paramName: string,
    validationRegex: RegExp,
    type: EParamType,
    required = false,
  ) {
    super(paramName, type, required);
    this._validationRegex = validationRegex;
  }

  protected validateParameter(req: Request, res: Response, next: NextFunction) {
    const param = this.getParameter(req);
    if (param) {
      const valid = this._validationRegex.test(param);
      if (valid) {
        LOGGER.info(
          `${this._type} parameter ${this._paramName} is okay - continuing`,
        );
        return next();
      }
      LOGGER.error(
        `${this._type} parameter ${this._paramName} not matching regex ${this._validationRegex}- raising error`,
      );
      return next(
        new ApiError(
          `Invalid ${this._type} parameter ${this._paramName}!`,
          undefined,
          400,
        ),
      );
    }
    return next(
      new ApiError(
        `${this._type} parameter ${this._paramName} is not defined!`,
        undefined,
        400,
      ),
    );
  }
}
