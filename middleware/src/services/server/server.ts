import express, { Express } from "express";
import { default as session } from "express-session";
import bodyParser from "body-parser";
import { ENABLE_HTTPS, SESSION_SECRET } from "config/server";
import { setupPassport } from "services/login";
import { default as cors } from "cors";
import { FRONTEND_URL } from "config/auth";
import * as http from "http";
import * as https from "https";
import { EXPRESS_LOGGER } from "services/loggers";
import { Database } from "services/database/database";
import { getSessionStore } from "services/server/session_store";

export abstract class Server<T extends http.Server | https.Server> {
    protected readonly _app: Express;
    protected readonly _port: number;
    private readonly _database: Database;

    get app(): Express {
        return this._app;
    }

    protected _server!: T;

    get server(): T {
        return this._server;
    }

    constructor(database: Database, port = 3001) {
        this._port = port
        this._database = database;
        this._app = express();
        this._app.set("port", port);
        this.configureMiddleware();
    }

    public configureMiddleware() {
        this.setupLogging();
        this.setupSession();
        this.setupBodyParsers();
        this.setupCors();
        this.setupOIDC();
    }

    private setupLogging() {
        this._app.use(EXPRESS_LOGGER);
    }

    private setupSession() {
        this._app.use(session({
            secret: SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: ENABLE_HTTPS,
                httpOnly: true
            },
            store: getSessionStore(this._database)
        }))
    }

    private setupBodyParsers() {
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: true }));
    }

    private setupCors() {
        this._app.use(cors({ origin: FRONTEND_URL, credentials: true }));
    }

    private async setupOIDC() {
        setupPassport(this._app);
    }

    public abstract start(): void;
}