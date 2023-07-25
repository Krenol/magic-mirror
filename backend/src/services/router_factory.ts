import { Router } from "express";
import { checkAuthenticated } from "services/middleware/authenticated";

export const getRouter = (protectedRoute: boolean): Router => {
  const router = Router();
  if (protectedRoute) router.use(checkAuthenticated);
  return router;
};
