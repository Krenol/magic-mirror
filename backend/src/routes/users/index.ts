import { getRouter } from "services/router_factory";
import {
  getMeUserSettings,
  patchMeUserSettings,
  postUserSettings,
  deleteMeUserSettings,
} from "routes/users/api/settings";
import { deleteMeUser } from "routes/users/api/users";

const router = getRouter();

router.get("/settings/me", getMeUserSettings);

router.patch("/settings/me", patchMeUserSettings);

router.post("/settings", postUserSettings);

router.delete("/settings/me", deleteMeUserSettings);

router.delete("/me", deleteMeUser);

export default router;
