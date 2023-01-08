import { Router } from "express";
import { allBirthdays } from "../controllers/birthdays/birthdays";
import { checkAuthenticated } from "../middleware/authenticated";
import { eventCountMiddleware } from "../middleware/event_count_middleware";

const router = Router();

router.use(checkAuthenticated)

router.get('/', [eventCountMiddleware], allBirthdays);

export default router;