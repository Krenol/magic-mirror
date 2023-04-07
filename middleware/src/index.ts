import { ENABLE_HTTPS, SERVER_PORT } from './config/server';
import { HttpServer } from './services/server/http_server';
import { HttpsServer } from './services/server/https_server';
import { default as WeatherRoute } from './routes/weather'
import { default as CalendarRoute } from './routes/calendar'
import { default as BirthdaysRoute } from './routes/birthdays'
import { default as AuthRoute } from './routes/auth';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from './models/api_error';
import { EXPRESS_ERROR_LOGGER } from './services/loggers';
import { MongoDb } from './services/database/mongodb';
import { mongoDbData } from './config/database';
import { removeUnauthorizedUsers, setupAllowedUsers } from './services/auth/setup_authorization';

const mongoDb: MongoDb = new MongoDb(mongoDbData);
setupAllowedUsers();
removeUnauthorizedUsers();
const server = ENABLE_HTTPS ? new HttpsServer(mongoDb, SERVER_PORT) : new HttpServer(mongoDb, SERVER_PORT);

server.app.use('/weather', WeatherRoute)
server.app.use('/calendar', CalendarRoute)
server.app.use('/birthdays', BirthdaysRoute)
server.app.use('/', AuthRoute)

// ERROR HANDLING
server.app.use(EXPRESS_ERROR_LOGGER)

server.app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.status).json({ error: err.message }).end();
})

server.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json({ error: "Oops... something unexpected happened!" }).end();
})

server.start();

export = server.app