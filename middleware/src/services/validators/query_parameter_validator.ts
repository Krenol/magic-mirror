import { NextFunction, Request, Response } from "express";
import { LOGGER } from "services/loggers";
import { requestQueryContainsParam } from "services/misc";
import { ApiError } from "models/api/api_error";


export abstract class QueryParameterValidator {
    protected readonly _paramName: string;
    protected readonly _paramMustExist: boolean;

    constructor(paramName: string, paramMustExist: boolean = false) {
        this._paramName = paramName;
        this._paramMustExist = paramMustExist;
    }

    public validate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        LOGGER.info(`Validate query parameter ${this._paramName}`);
        const exists = await requestQueryContainsParam(req, this._paramName);
        if (!exists && !this._paramMustExist) {
            LOGGER.info(`Non required query parameter ${this._paramName} not existing in request - continuing`);
            return next();
        } else if (!exists && this._paramMustExist) {
            LOGGER.error(`Required query parameter ${this._paramName} not existing in request - raising error`);
            return next(new ApiError(`Query parameter ${this._paramName} is required!`, undefined, 400));
        }
        return this.validateQueryParam(req, res, next);
    }

    protected abstract validateQueryParam(req: Request, res: Response, next: NextFunction): void;
}