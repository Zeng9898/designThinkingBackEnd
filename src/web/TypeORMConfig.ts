import "reflect-metadata"
import { DataSource } from "typeorm"
import { PostEntity } from "./entity/PostEntity"
import { GroupingActivityEntity } from "./entity/GroupingActivityEntity"
import { UserEntity } from "./entity/UserEntity"
import { DTActivityEntity } from "./entity/DTActivityEntity"
import { StageEntity } from "./entity/StageEntity"
import { SubStageEntity } from "./entity/SubStageEntity"
import { ThinkingRoutineEntity } from "./entity/ThinkingRoutineEntity"
import { IdeaEntity } from "./entity/IdeaEntity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "floatsky65",
    database: "postgres",
    entities: [PostEntity, GroupingActivityEntity, UserEntity, DTActivityEntity, StageEntity, SubStageEntity, ThinkingRoutineEntity, IdeaEntity],
    synchronize: true, // Setting synchronize makes sure your entities will be synced with the database, every time you run the application.
    logging: false,
})