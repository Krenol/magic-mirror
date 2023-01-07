import { Request, Response } from "express";
import { CALENDAR_CONFIG } from "../../config/google";
import { User } from "../../models/user";
import { getBirthdayEvents } from "../../services/calendar/events";
import { createApiError } from "../../services/error_message";

export const allBirthdays = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    return getBirthdayEvents(req.user as User, parseInt((req.query.count || CALENDAR_CONFIG.DEFAULT_EVENT_COUNT).toString()))
        .then(response => res.json(response.body).status(200))
        .catch(() => createApiError(res, "Error while retrieving calendar events", 500))
}
