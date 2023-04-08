import { getRouter } from "services/router_factory";
import { allBirthdays } from "./api";
import { eventCountMiddleware } from "./middleware";

const router = getRouter(true);

router.get('/', [eventCountMiddleware.validate], allBirthdays);

export default router;