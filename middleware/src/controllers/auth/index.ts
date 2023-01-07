import { Request, Response } from "express";

export const logout = (req: Request, res: Response) => {
    req.session.destroy(() => req.logout(() => { res.status(200).json({ success: true }) }));
}