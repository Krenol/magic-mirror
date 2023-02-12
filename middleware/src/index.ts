import { SERVER_PORT } from './config/server';
import { Server } from './server';
import { default as WeatherRoute } from './routes/weather'
import { default as CalendarRoute } from './routes/calendar'
import { default as BirthdaysRoute } from './routes/birthdays'
import { default as AuthRoute } from './routes/auth';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from './models/api_error';
import { EXPRESS_ERROR_LOGGER } from './services/loggers';

const server = new Server(SERVER_PORT);

server.app.use('/weather', WeatherRoute)
server.app.use('/calendar', CalendarRoute)
server.app.use('/birthdays', BirthdaysRoute)
server.app.use('/', AuthRoute)

// ERROR HANDLING
server.app.use(EXPRESS_ERROR_LOGGER)

server.app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status).json({ error: err.message })
})

server.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ error: "Oops... something unexpected happened!" })
})

server.start();

export = server.app