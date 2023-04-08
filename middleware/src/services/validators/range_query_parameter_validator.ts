import { Request, Response, NextFunction } from "express";
import { QueryParameterValidator } from "services/validators/query_parameter_validator";
import { LOGGER } from "services/loggers";
import { ApiError } from "models/api/api_error";

export type IRange = {
    min: number,
    max: number
}

export class RangeQueryParameterValidator extends QueryParameterValidator {
    private readonly _range: IRange;

    constructor(paramName: string, range: IRange, paramMustExist: boolean = false) {
        super(paramName, paramMustExist);
        this._range = range;
    }

    protected validateQueryParam(req: Request, res: Response, next: NextFunction) {
        const param = parseInt(req.query[this._paramName]!.toString());
        const valid = param >= this._range.min && param <= this._range.max;
        if (valid) {
            LOGGER.info(`Query parameter ${this._paramName} is okay - continuing`);
            return next();
        }
        LOGGER.error(`Query parameter ${this._paramName} is out of range [${this._range.min},${this._range.max}] - raising error`);
        return next(new ApiError(`Query parameter ${this._paramName} out of range [${this._range.min},${this._range.max}]!`, undefined, 400));
    }
}