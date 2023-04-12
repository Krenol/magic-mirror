import { Request, Response, NextFunction } from "express";
import { ParameterValidator, EParamType } from "services/validators/parameter_validator";
import { LOGGER } from "services/loggers";
import { ApiError } from "models/api/api_error";

export type IRange = {
    min: number,
    max: number
}

export class RangeParameterValidator extends ParameterValidator {
    private readonly _range: IRange;

    constructor(paramName: string, range: IRange, type: EParamType, required = false) {
        super(paramName, type, required);
        this._range = range;
    }

    protected validateParameter(req: Request, res: Response, next: NextFunction) {
        const paramStr = this.getParameter(req);
        if (paramStr) {
            const param = parseInt(paramStr);
            const valid = param >= this._range.min && param <= this._range.max;
            if (valid) {
                LOGGER.info(`${this._type} parameter ${this._paramName} is okay - continuing`);
                return next();
            }
            LOGGER.error(`${this._type} parameter ${this._paramName} is out of range [${this._range.min},${this._range.max}] - raising error`);
            return next(new ApiError(`${this._type} parameter ${this._paramName} out of range [${this._range.min},${this._range.max}]!`, undefined, 400));
        }
        return next(new ApiError(`${this._type} parameter ${this._paramName} is not defined!`, undefined, 400));
    }
}