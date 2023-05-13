import { getRouter } from "services/router_factory";
import { getUserSettings, updatetUserSettings } from "routes/users/api";

const router = getRouter(true);

router.get('/settings', getUserSettings);

router.put('/settings', updatetUserSettings);

export default router;