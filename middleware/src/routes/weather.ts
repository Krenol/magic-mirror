import { Request, Response, Router } from "express";
import { getCurrentWeather } from "../controllers/weather/current";
import { getWeatherForecast } from "../controllers/weather/forecasts";
import { getHourlyWeather } from "../controllers/weather/hourly";
import { getWeatherIcon } from "../controllers/weather/icons";
import { checkAuthenticated } from "../middleware/authenticated";
import { locationMiddleware } from "../middleware/location_middleware";
import { validateHourlyForecastHours } from "../middleware/validate_hourly_forecast_hours";
import { validateWeatherForecastDays } from "../middleware/validate_weather_forecast_days";

const router = Router();

router.get('/current', [checkAuthenticated, locationMiddleware], getCurrentWeather)

router.get('/hourly', [locationMiddleware, validateHourlyForecastHours], getHourlyWeather)

router.get('/forecast', [checkAuthenticated, locationMiddleware, validateWeatherForecastDays], async (req: Request, res: Response) => {
    return getWeatherForecast(req, res);
})

router.get('/icon/:weatherCode', checkAuthenticated, async (req: Request, res: Response) => {
    return getWeatherIcon(req, res);
})

export default router;