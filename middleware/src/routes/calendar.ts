import { Router } from "express";
import { allEvents, nextEvent } from "../controllers/calendar/events";
import { checkAuthenticated } from "../middleware/authenticated";
import { eventCountMiddleware } from "../middleware/event_count_middleware"
import RateLimit from "express-rate-limit";
import { RATE_LIMIT } from "../config/apis";

const router = Router();
var limiter = RateLimit(RATE_LIMIT);
router.use(limiter);

router.use(checkAuthenticated)

router.get('/', [eventCountMiddleware], allEvents);

router.get('/next', nextEvent)

export default router;