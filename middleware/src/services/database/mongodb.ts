import { Database, IDatabaseConenction } from "./database";
import { connect } from 'mongoose';

export class MongoDb extends Database {
    private _connection: any;
    constructor(dbConnection: IDatabaseConenction) {
        super(dbConnection, "mongodb");
    }

    protected buildConnectionString(dbConnection: IDatabaseConenction): string {
        let credentials = dbConnection.username && dbConnection.password ? `${dbConnection.username}:${dbConnection.password}` : "";
        let options = dbConnection.options ? "?" + dbConnection.options?.map(op => `${op.name}=${op.value}`).join('&') : "";
        return `${this._databaseType}://${credentials}@${dbConnection.hostname}:${dbConnection.port}/${dbConnection.database}${options}`
    }

    protected initDatabaseConnection(): void {
        connect(this._connectionString)
            .then(con => this._connection = con);
    }
}