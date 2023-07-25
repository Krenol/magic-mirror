import { getRouter } from "services/router_factory";
import { getGeocodeOfAddress } from "./api";
import { geocodeMw } from "./middleware";

const router = getRouter(true);

router.get("/geocode", geocodeMw, getGeocodeOfAddress);

export default router;
