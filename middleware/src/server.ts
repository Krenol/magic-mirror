import * as http from "http";
import express, { NextFunction, Express } from "express";
import { default as session } from "express-session";
import bodyParser from "body-parser";
import { createApiError } from "./services/error_message";
import { SESSION_SECRET } from "./config/server";
import { setupPassport } from "./services/auth/setup";
import { default as cors } from "cors";
import { FRONTEND_URL } from "./config/auth";

export class Server {
    private readonly _app: Express;

    get app(): Express {
        return this._app;
    }

    private _server!: http.Server;

    get server(): http.Server {
        return this._server;
    }

    constructor(port = 3001) {
        this._app = express();
        this._app.set("port", port);
        this.configureMiddleware();
    }

    public configureMiddleware() {
        this.setupSession();
        this.setupBodyParsers();
        this.setupCors();
        this.setupGeneralErrorResponse();
        this.setupOIDC();
    }

    private setupBodyParsers() {
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: true }));
    }

    private setupCors() {
        this._app.use(cors({ origin: FRONTEND_URL, credentials: true }));
    }

    private setupGeneralErrorResponse() {
        this._app.use(async (err: Error, req: express.Request, res: express.Response, next: NextFunction) => {
            createApiError(res, "Something very wrong happened!", 500);
        });
    }

    private setupSession() {
        this._app.use(session({
            secret: SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false }
        }))
    }

    private async setupOIDC() {
        setupPassport(this._app);
    }

    public start() {
        this._server = this._app.listen(this._app.get("port"), () => {
            console.log("Server is running on port " + this._app.get("port"));
        });
    }
}