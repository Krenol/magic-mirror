import { SERVER_PORT } from './config/server';
import { Server } from './server';
import { default as WeatherRoute } from './routes/weather'
import { default as CalendarRoute } from './routes/calendar'
import { default as BirthdaysRoute } from './routes/birthdays'
import { default as AuthRoute } from './routes/auth';

const server = new Server(SERVER_PORT);

server.app.use('/weather', WeatherRoute)
server.app.use('/calendar', CalendarRoute)
server.app.use('/birthdays', BirthdaysRoute)
server.app.use('/', AuthRoute)

server.start();

export = server.app