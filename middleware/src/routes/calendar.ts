import { Router } from "express";
import { allEvents, nextEvent } from "../controllers/calendar/events";
import { checkAuthenticated } from "../middleware/authenticated";
import { eventCountMiddleware } from "../middleware/event_count_middleware"

const router = Router();
router.get('/', [checkAuthenticated, eventCountMiddleware], allEvents);
router.get('/next', nextEvent)

export default router;