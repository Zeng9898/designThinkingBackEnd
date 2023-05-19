import { UserEntity } from '../entity/UserEntity';
import { DTActivityEntity } from '../entity/DTActivityEntity';
import { AppDataSource } from "../TypeORMConfig";
import { Repository } from 'typeorm';
import { StageEntity } from '../entity/StageEntity';
import { SubStageEntity } from '../entity/SubStageEntity';
import { ThinkingRoutineEntity } from '../entity/ThinkingRoutineEntity';

//dotenv.config();

export interface DesignThinkingActivityRepository {
    create(designThinkingActivityName: string): Promise<void>/*Promise<DTActivityEntity>*/
    joinUser(username: string, designThinkingActivityId: number): Promise<void>
    read(designThinkinActivityId: number): Promise<object>
}

export class DesignThinkingActivityRepositoryIpml implements DesignThinkingActivityRepository {
    private readonly DTArepository: Repository<DTActivityEntity>;
    private readonly stageRepository: Repository<StageEntity>;
    private readonly subStageRepository: Repository<SubStageEntity>;
    private readonly thinkingRoutineRepository: Repository<ThinkingRoutineEntity>;
    private readonly userRepository: Repository<UserEntity>;


    constructor() {
        this.DTArepository = AppDataSource.getRepository(DTActivityEntity);
        this.stageRepository = AppDataSource.getRepository(StageEntity);
        this.subStageRepository = AppDataSource.getRepository(SubStageEntity);
        this.thinkingRoutineRepository = AppDataSource.getRepository(ThinkingRoutineEntity);
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }

    async create(designThinkingActivityName: string):/*Promise<DTActivityEntity>*/Promise<void> {
        const DTActivity = new DTActivityEntity(designThinkingActivityName);
        await this.DTArepository.save(DTActivity);
        const stage = new StageEntity('同理');
        stage.dtActivityEntity = DTActivity;
        await this.stageRepository.save(stage);
        const subStage = new SubStageEntity('定義利害關係人', '在此階段中參與者需要定義出與主題有關的利害關係人，通常會先讓組別中的每個人獨自提出想法，再綜合組別裡的每個人的想法。', false);
        subStage.stageEntity = stage;
        await this.subStageRepository.save(subStage);
        thinkingRoutines.forEach(async (routine) => {
            const thinkingRoutine = new ThinkingRoutineEntity(routine.thinkingRoutineName, routine.thinkingRoutineType, routine.belongColumn, routine.needChecked, routine.index);
            thinkingRoutine.subStageEntity = subStage;
            await this.thinkingRoutineRepository.save(thinkingRoutine);
        })
    }

    async joinUser(username: string, designThinkingActivityId: number): Promise<void> {
        const user = await this.userRepository.findOneBy({ username: username },);
        const designThinkingActivity = await this.DTArepository.findOne({
            relations: {
                users: true,
            },
            where: {
                id: designThinkingActivityId,
            },
        });
        if (designThinkingActivity && user) {
            console.log(designThinkingActivity.users);
            designThinkingActivity.users = designThinkingActivity.users || [];
            designThinkingActivity.users.push(user);
            console.log(designThinkingActivity.users);
            await this.DTArepository.save(designThinkingActivity);
        } else {
            throw Error('username not exist or designThinkingActivityId not exist');
        }
    }

    async read(designThinkingActivityId: number): Promise<object> {
        // const designThinkingActivity = await AppDataSource.createQueryBuilder(DTActivityEntity, 'DTActivityEntity')
        //     .leftJoinAndSelect('DTActivityEntity.stages', 'stage').leftJoinAndSelect('stage.subStages', 'subStage')
        //     .where('DTActivityEntity.id = :id', { id: designThinkinActivityId }).getOne();

        const designThinkingActivity = await this.DTArepository.findOne({
            relations: ['users', 'stages', 'stages.substages', 'stages.substages.thinkingRoutines'],
            where: { id: designThinkingActivityId },
        });
        if (designThinkingActivity === null) {
            throw Error('designThinkingActivityId not exist');
        } else {
            return designThinkingActivity;
        }

    }
}

const thinkingRoutines = [
    {
        thinkingRoutineName: "列出利害關係人",
        thinkingRoutineType: "發散",
        asignees: ["zeng"],
        hint: "請列出你心目中的利害關係人",
        needChecked: true,
        belongColumn: "待排程",
        index: 0
    },
    {
        thinkingRoutineName: "列出利害關係人",
        thinkingRoutineType: "發散",
        asignees: ["kang"],
        hint: "請列出你心目中的利害關係人",
        needChecked: true,
        belongColumn: "待排程",
        index: 1
    },
    {
        thinkingRoutineName: "列出利害關係人",
        thinkingRoutineType: "發散",
        asignees: ["houl"],
        hint: "請列出你心目中的利害關係人",
        needChecked: true,
        belongColumn: "待排程",
        index: 2
    },
    {
        thinkingRoutineName: "列出利害關係人",
        thinkingRoutineType: "發散",
        asignees: ["yang"],
        hint: "請列出你心目中的利害關係人",
        needChecked: true,
        belongColumn: "待排程",
        index: 3
    },
    {
        thinkingRoutineName: "歸納利害關係人",
        thinkingRoutineType: "歸納",
        asignees: ["yang", "zeng", "kang", "houl"],
        hint: "請將類型相似的利害關係人貼上標籤",
        needChecked: true,
        belongColumn: "進行中",
        index: 0
    },
    {
        thinkingRoutineName: "自我介紹",
        thinkingRoutineType: "發散",
        asignees: ["yang", "zeng", "kang", "houl"],
        hint: "請說出自己的特質",
        needChecked: false,
        belongColumn: "已完成",
        index: 0
    }
]