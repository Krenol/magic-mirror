import * as https from "https";
import { LOGGER } from "../loggers";
import { Server } from "./server";
import * as fs from "fs";
import { SSL_CERTIFICATE, SSL_PRIVATE_KEY } from "../../config/server";
import { Database } from "../database/database";

export class HttpsServer extends Server<https.Server> {
    private readonly _serverOptions;
    constructor(database: Database, port = 3001) {
        super(database, port)
        let privateKey = fs.readFileSync(SSL_PRIVATE_KEY, 'utf8');
        let certificate = fs.readFileSync(SSL_CERTIFICATE, 'utf8');
        this._serverOptions = { key: privateKey, cert: certificate };
    }

    public start() {
        this._server = https.createServer(this._serverOptions, this._app).listen(this._port, () => {
            LOGGER.info(`HTTPS Server is running on port ${this._port}`);
        });
    }
}