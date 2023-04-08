import { Router } from "express";
import { RATE_LIMIT } from "config/apis";
import RateLimit from "express-rate-limit";
import { checkAuthenticated } from "middleware/authenticated";

export const getRouter = (protectedRoute: boolean): Router => {
    const router = Router();
    var limiter = RateLimit(RATE_LIMIT);
    router.use(limiter);
    if (protectedRoute) router.use(checkAuthenticated);
    return router;
}