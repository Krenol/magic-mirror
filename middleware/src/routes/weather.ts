import { Router } from "express";
import { getCurrentWeather } from "../controllers/weather/current";
import { getWeatherForecast } from "../controllers/weather/forecasts";
import { getHourlyWeather } from "../controllers/weather/hourly";
import { getWeatherIcon } from "../controllers/weather/icons";
import { checkAuthenticated } from "../middleware/authenticated";
import { locationMiddleware } from "../middleware/location_middleware";
import { validateHourlyForecastHours } from "../middleware/validate_hourly_forecast_hours";
import { validateWeatherForecastDays } from "../middleware/validate_weather_forecast_days";
import RateLimit from "express-rate-limit";
import { RATE_LIMIT } from "../config/apis";

const router = Router();
var limiter = RateLimit(RATE_LIMIT);
router.use(limiter);

router.use(checkAuthenticated)

router.get('/current', [locationMiddleware], getCurrentWeather)

router.get('/hourly', [validateHourlyForecastHours], getHourlyWeather)

router.get('/forecast', [locationMiddleware, validateWeatherForecastDays], getWeatherForecast)

router.get('/icon/:weatherCode', getWeatherIcon)

export default router;