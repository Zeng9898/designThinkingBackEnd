import "reflect-metadata"
import { DataSource } from "typeorm"
import { PostEntity } from "./entity/PostEntity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "floatsky65",
    database: "postgres",
    entities: [PostEntity],
    synchronize: true, // Setting synchronize makes sure your entities will be synced with the database, every time you run the application.
    logging: false,
})