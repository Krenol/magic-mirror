import { getRouter } from "services/router_factory";
import { getUserSettings, patchUserSettings, postUserSettings } from "routes/users/api";

const router = getRouter(true);

router.get('/settings', getUserSettings);

router.patch('/settings', patchUserSettings);

router.post('/settings', postUserSettings);

export default router;