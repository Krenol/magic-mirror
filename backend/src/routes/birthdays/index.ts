import { getRouter } from "services/router_factory";
import { allBirthdays } from "routes/birthdays/api";
import { eventCountMiddleware } from "routes/birthdays/middleware";

const router = getRouter(true);

router.get("/", [eventCountMiddleware.validate], allBirthdays);

export default router;
