import { Router } from "express";

export const getRouter = (protectedRoute: boolean): Router => {
  const router = Router();
  return router;
};
