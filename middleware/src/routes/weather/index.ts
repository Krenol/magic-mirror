import { getCurrentWeather } from "routes/weather/api/current";
import { getWeatherForecast } from "routes/weather/api/forecasts";
import { getHourlyWeather } from "routes/weather/api/hourly";
import { getWeatherIcon } from "routes/weather/api/icons";
import { locationMiddleware } from "middleware/location_middleware";
import { validateHourlyForecastHours } from "middleware/validate_hourly_forecast_hours";
import { validateWeatherForecastDays } from "middleware/validate_weather_forecast_days";
import { getRouter } from "services/router_factory";

const router = getRouter(true);

router.get('/current', [locationMiddleware], getCurrentWeather)

router.get('/hourly', [validateHourlyForecastHours], getHourlyWeather)

router.get('/forecast', [locationMiddleware, validateWeatherForecastDays], getWeatherForecast)

router.get('/icon/:weatherCode', getWeatherIcon)

export default router;