import { getCurrentWeather } from "routes/weather/api/current";
import { getWeatherForecast } from "routes/weather/api/forecasts";
import { getHourlyWeather } from "routes/weather/api/hourly";
import { getWeatherIcon } from "routes/weather/api/icons";
import { getRouter } from "services/router_factory";
import { currentMw, daysMw, hourlyMw, weatherIconMw } from "./middleware";

const router = getRouter(true);

router.get('/current', currentMw, getCurrentWeather);

router.get('/hourly', hourlyMw, getHourlyWeather);

router.get('/forecast', daysMw, getWeatherForecast);

router.get('/icon/:weatherCode', weatherIconMw, getWeatherIcon);

export default router;