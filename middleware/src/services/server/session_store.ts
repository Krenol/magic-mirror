import MongoStore from "connect-mongo";
import session from "express-session"
import { Database } from "../database/database"

const getMongoStore = (database: Database): session.Store => {
    return new MongoStore({ mongoUrl: database.getConnectionString() })
}

const funcMap = new Map<string, (database: Database) => session.Store>([
    ["mongodb", getMongoStore]
]);

export const getSessionStore = (database: Database): session.Store | undefined => {
    if (funcMap.has(database.getDatabaseType())) {
        const f = funcMap.get(database.getDatabaseType());
        return f!(database);
    }
    return;
}