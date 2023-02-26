import * as http from "http";
import { LOGGER } from "./services/loggers";
import { Server } from "./server";

export class HttpServer extends Server<http.Server> {
    constructor(port = 3001) {
        super(port)
    }

    public start() {
        this._server = http.createServer(this._app).listen(this._port, () => {
            LOGGER.info(`HTTP Server is running on port ${this._port}`);
        });
    }
}