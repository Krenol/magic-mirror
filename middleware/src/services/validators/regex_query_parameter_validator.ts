import { Request, Response, NextFunction } from "express";
import { QueryParameterValidator } from "services/validators/query_parameter_validator";
import { LOGGER } from "services/loggers";
import { ApiError } from "models/api/api_error";

export class RegexQueryParameterValidator extends QueryParameterValidator {
    private readonly _validationRegex: RegExp;

    constructor(paramName: string, validationRegex: RegExp, paramMustExist: boolean = false) {
        super(paramName, paramMustExist);
        this._validationRegex = validationRegex;
    }

    protected validateQueryParam(req: Request, res: Response, next: NextFunction) {
        const param = req.query[this._paramName]!.toString();
        const valid = this._validationRegex.test(param);
        if (valid) {
            LOGGER.info(`Query parameter ${this._paramName} is okay - continuing`);
            return next();
        }
        LOGGER.error(`Query parameter ${this._paramName} not matching regex ${this._validationRegex}- raising error`);
        return next(new ApiError(`Invalid query parameter ${this._paramName}!`, undefined, 400));
    }
}