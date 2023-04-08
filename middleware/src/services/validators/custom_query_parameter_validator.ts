import { Request, Response, NextFunction } from "express";
import { QueryParameterValidator } from "services/validators/query_parameter_validator";
import { LOGGER } from "services/loggers";
import { ApiError } from "models/api/api_error";

export type IValidationFunc = (param: string) => Promise<boolean>;

export class CustomQueryParameterValidator extends QueryParameterValidator {
    private readonly _validationFunc: IValidationFunc;

    constructor(paramName: string, validationFunc: IValidationFunc, paramMustExist: boolean = false) {
        super(paramName, paramMustExist);
        this._validationFunc = validationFunc;
    }

    protected validateQueryParam(req: Request, res: Response, next: NextFunction) {
        const param = req.query[this._paramName]!.toString();
        return this._validationFunc(param)
            .then(valid => this.handleValidationResponse(valid, next));
    }

    private handleValidationResponse = async (valid: boolean, next: NextFunction) => {
        if (valid) {
            LOGGER.info(`Query parameter ${this._paramName} is okay - continuing`);
            return next();
        }
        LOGGER.error(`Query parameter ${this._paramName} not matching validation function - raising error`);
        return next(new ApiError(`Query parameter ${this._paramName} is invalid!`, undefined, 400));
    }
}