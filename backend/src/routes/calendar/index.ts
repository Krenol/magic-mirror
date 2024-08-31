import { allCalendarEvents, eventsAtDate } from 'routes/calendar/api';
import { getRouter } from 'services/router_factory';
import { allEventsMw, dateEventsMw } from 'routes/calendar/middleware';

const router = getRouter();

router.get('/', allEventsMw, allCalendarEvents);

router.get('/:date', dateEventsMw, eventsAtDate);

export default router;
