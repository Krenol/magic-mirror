import { getRouter } from "services/router_factory";
import { getUserSettings, patchUserSettings, postUserSettings, deleteUserSettings } from "routes/users/api";

const router = getRouter(true);

router.get('/settings', getUserSettings);

router.patch('/settings', patchUserSettings);

router.post('/settings', postUserSettings);

router.delete('/settings', deleteUserSettings);

export default router;