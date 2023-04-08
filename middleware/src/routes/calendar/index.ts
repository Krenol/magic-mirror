import { allCalendarEvents, eventsAtDate } from "routes/calendar/api";
import { getRouter } from "services/router_factory";
import { allEventsMw, dateEventsMw } from "./middleware";

const router = getRouter(true);

router.get('/', allEventsMw, allCalendarEvents);

router.get('/:date', dateEventsMw, eventsAtDate)

export default router;