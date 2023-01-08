import { Request } from "express";

export class ApiError extends Error {
    private readonly _thrownError: Error;
    private readonly _status: number;

    constructor(message: string, thrownError: Error, status = 500) {
        super(message);
        this.name = "ApiError";
        this._thrownError = thrownError;
        this._status = status
    }

    get thrownError(): Error {
        return this._thrownError;
    }

    get status(): number {
        return this._status;
    }
}