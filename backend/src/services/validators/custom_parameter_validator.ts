import { Request, Response, NextFunction } from "express";
import {
  EParamType,
  ParameterValidator,
} from "services/validators/parameter_validator";
import { LOGGER } from "services/loggers";
import { ApiError } from "models/api/api_error";

export type IValidationFunc = (param: string) => Promise<boolean>;

export class CustomParameterValidator extends ParameterValidator {
  private readonly _validationFunc: IValidationFunc;

  constructor(
    paramName: string,
    validationFunc: IValidationFunc,
    type: EParamType,
    required = false,
  ) {
    super(paramName, type, required);
    this._validationFunc = validationFunc;
  }

  protected validateParameter(req: Request, res: Response, next: NextFunction) {
    const param = this.getParameter(req);
    if (param) {
      return this._validationFunc(param).then((valid) =>
        this.handleValidationResponse(valid, next),
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

  private handleValidationResponse = async (
    valid: boolean,
    next: NextFunction,
  ) => {
    if (valid) {
      LOGGER.info(
        `${this._type} parameter ${this._paramName} is okay - continuing`,
      );
      return next();
    }
    LOGGER.error(
      `${this._type} parameter ${this._paramName} not matching validation function - raising error`,
    );
    return next(
      new ApiError(
        `${this._type} parameter ${this._paramName} is invalid!`,
        undefined,
        400,
      ),
    );
  };
}
