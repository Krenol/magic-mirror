import * as https from "http2";
import { LOGGER } from "services/loggers";
import { Server } from "services/server/server";
import * as fs from "fs";
import { SSL_CERTIFICATE, SSL_PRIVATE_KEY } from "config";
import { Database } from "services/database/database";

export class HttpsServer extends Server<https.Http2SecureServer> {
  private readonly _serverOptions;
  constructor(database: Database, port = 3001) {
    super(database, port);
    const privateKey = fs.readFileSync(SSL_PRIVATE_KEY, "utf8");
    const certificate = fs.readFileSync(SSL_CERTIFICATE, "utf8");
    this._serverOptions = {
      key: privateKey,
      cert: certificate,
      allowHTTP1: true,
    };
  }

  public start() {
    this._server = https
      .createSecureServer(this._serverOptions, this._app)
      .listen(this._port, () => {
        LOGGER.info(`HTTPS Server is running on port ${this._port}`);
      });
  }
}
