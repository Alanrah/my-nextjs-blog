import "reflect-metadata"; // todo 用处
import { DataSource, DataSourceOptions } from "typeorm"
import { User, UserAuth } from "./entity";

export const AppDataSource = new DataSource({
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PWD, // 19940313 123mysql
    database: process.env.DATABASE_NAME,
    // 把涉及的表引进来
    entities: [
        User,
        UserAuth,
    ],
    synchronize: false,
    logging: false,
    subscribers: [],
    migrations: [],
} as DataSourceOptions)
