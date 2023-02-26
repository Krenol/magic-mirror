import { randomUUID } from "crypto"

export const SERVER_PORT = parseInt(process.env.PORT || String(3001));
export const SESSION_SECRET = process.env.SESSION_SECRET || randomUUID();
export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
export const PROXY_SERVER_HOSTNAME = process.env.PROXY_SERVER_HOSTNAME || SERVER_HOSTNAME;
export const PROXY_SERVER_PORT = process.env.PROXY_SERVER_PORT || SERVER_PORT;
export const PROXY_SERVER_PROTOCOL = process.env.PROXY_SERVER_PROTOCOL || "http";
export const ENABLE_HTTPS = (process.env.ENABLE_HTTPS?.toLowerCase() || "false") === "true"
export const SSL_PRIVATE_KEY = process.env.SSL_PRIVATE_KEY || "/etc/express/express.key"
export const SSL_CERTIFICATE = process.env.SSL_PRIVATE_KEY || "/etc/express/express.pem"
