import { AppDataSource } from "../TypeORMConfig";
import { Repository } from 'typeorm';
import { ThinkingRoutineEntity } from '../entity/ThinkingRoutineEntity';

//dotenv.config();

export interface ThinkingRoutineRepository {
    read(thinkingRoutineId: number): Promise<ThinkingRoutineEntity>
}

export class ThinkingRoutineRepositoryIpml implements ThinkingRoutineRepository {
    private readonly thinkingRoutineRepository: Repository<ThinkingRoutineEntity>;


    constructor() {
        this.thinkingRoutineRepository = AppDataSource.getRepository(ThinkingRoutineEntity);
    }
    async read(thinkingRoutineId: number): Promise<ThinkingRoutineEntity> {
        // const designThinkingActivity = await AppDataSource.createQueryBuilder(DTActivityEntity, 'DTActivityEntity')
        //     .leftJoinAndSelect('DTActivityEntity.stages', 'stage').leftJoinAndSelect('stage.subStages', 'subStage')
        //     .where('DTActivityEntity.id = :id', { id: designThinkinActivityId }).getOne();

        const thinkingRoutine = await this.thinkingRoutineRepository.findOne({
            relations: ['ideas', 'assignees','ideas.owner', 'ideas.to'],
            where: { id: thinkingRoutineId },
        });
        if (thinkingRoutine === null) {
            throw Error('thinkingRoutineId not exist');
        } else {
            return thinkingRoutine;
        }

    }
}
