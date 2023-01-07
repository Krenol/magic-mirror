import { Response } from "express";

export const createApiError = async (res: Response, error_message: string, status_code: number): Promise<Response> => {
    return res.status(status_code).json({ error: error_message })
}