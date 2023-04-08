import { allEvents, nextEvent } from "routes/calendar/api";
import { getRouter } from "services/router_factory";
import { allEventsMw } from "./middleware";

const router = getRouter(true);

router.get('/', allEventsMw, allEvents);

router.get('/next', nextEvent)

export default router;