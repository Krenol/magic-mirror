import { IDatabaseConenction } from "../services/database/database";

export const mongoDbData: IDatabaseConenction = {
    hostname: process.env.MONGO_HOSTNAME || "mongo",
    port: parseInt(process.env.MONGO_PORT || "27017"),
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    database: process.env.MONGO_DATABASE,
    options: [
        {
            name: 'authSource',
            value: 'admin'
        },
        {
            name: 'ssl',
            value: process.env.MONGO_SSL || "false"
        }
    ]
}