import { UserEntity } from '../entity/UserEntity';
import { DTActivityEntity } from '../entity/DTActivityEntity';
import { AppDataSource } from "../TypeORMConfig";
import { Repository } from 'typeorm';
import { StageEntity } from '../entity/StageEntity';
import { SubStageEntity } from '../entity/SubStageEntity';
import { ThinkingRoutineEntity } from '../entity/ThinkingRoutineEntity';

//dotenv.config();

export interface DesignThinkingActivityRepository {
    create(designThinkingActivityName: string, designThinkingActivityDescription: string, leaderId: number): Promise<DTActivityEntity>/*Promise<DTActivityEntity>*/
    joinUser(username: string, designThinkingActivityId: number): Promise<DTActivityEntity>
    read(designThinkinActivityId: number): Promise<DTActivityEntity>
    findDesignThinkingActivityForUser(userId: number): Promise<DTActivityEntity[]>
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

    async create(designThinkingActivityName: string, designThinkingActivityDescription: string, leaderId: number):/*Promise<DTActivityEntity>*/Promise<DTActivityEntity> {
        // const DTActivity = new DTActivityEntity(designThinkingActivityName);
        // await this.DTArepository.save(DTActivity);
        // const stage = new StageEntity('同理', DTActivity);
        // await this.stageRepository.save(stage);
        // const subStage = new SubStageEntity('定義利害關係人', '在此階段中參與者需要定義出與主題有關的利害關係人，通常會先讓組別中的每個人獨自提出想法，再綜合組別裡的每個人的想法。', false, stage);
        // await this.subStageRepository.save(subStage);
        // thinkingRoutines.forEach(async (routine) => {
        //     const thinkingRoutine = new ThinkingRoutineEntity(routine.thinkingRoutineName, routine.thinkingRoutineType, routine.belongColumn, routine.needChecked, routine.index, routine.hint, subStage);
        //     const assignees = routine.assignees;
        //     console.log(assignees);
        //     const assignedUsers = await this.userRepository
        //         .createQueryBuilder('user')
        //         .where('user.username IN (:...usernames)',{ usernames:assignees})
        //         .getMany();
        //     console.log(assignedUsers);
        //     thinkingRoutine.assignees = assignedUsers;
        //     await this.thinkingRoutineRepository.save(thinkingRoutine);
        // })
        // return DTActivity;
        const DTActivity = new DTActivityEntity(designThinkingActivityName, designThinkingActivityDescription);
        const leader = await this.userRepository.findOneBy({ id: leaderId });
        if (leader) {
            DTActivity.leaderShip = leader;
            DTActivity.users = DTActivity.users || [];
            DTActivity.users.push(leader);
            await this.DTArepository.save(DTActivity);
        } else {
            throw Error('userId is not existed');
        }
        const stage = new StageEntity('同理', DTActivity);
        await this.stageRepository.save(stage);
        const subStage = new SubStageEntity('定義利害關係人', '在此階段中參與者需要定義出與主題有關的利害關係人，通常會先讓組別中的每個人獨自提出想法，再綜合組別裡的每個人的想法。', false, stage);
        await this.subStageRepository.save(subStage);
        thinkingRoutines.forEach(async (routine) => {
            const thinkingRoutine = new ThinkingRoutineEntity(routine.thinkingRoutineName, routine.thinkingRoutineType, routine.belongColumn, routine.needChecked, routine.index, routine.hint, subStage);
            const assignees = routine.assignees;
            console.log(assignees);
            const assignedUsers = await this.userRepository
                .createQueryBuilder('user')
                .where('user.username IN (:...usernames)', { usernames: assignees })
                .getMany();
            console.log(assignedUsers);
            thinkingRoutine.assignees = assignedUsers;
            await this.thinkingRoutineRepository.save(thinkingRoutine);
        })
        return DTActivity;
    }

    async joinUser(username: string, designThinkingActivityId: number): Promise<DTActivityEntity> {
        const user = await this.userRepository.findOneBy({ username: username });
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
            return await this.DTArepository.save(designThinkingActivity);
        } else {
            throw Error('username not exist or designThinkingActivityId not exist');
        }
    }

    async read(designThinkingActivityId: number): Promise<DTActivityEntity> {
        // const designThinkingActivity = await AppDataSource.createQueryBuilder(DTActivityEntity, 'DTActivityEntity')
        //     .leftJoinAndSelect('DTActivityEntity.stages', 'stage').leftJoinAndSelect('stage.subStages', 'subStage')
        //     .where('DTActivityEntity.id = :id', { id: designThinkinActivityId }).getOne();

        const designThinkingActivity = await this.DTArepository.findOne({
            relations: ['users', 'stages', 'stages.substages', 'stages.substages.thinkingRoutines', 'stages.substages.thinkingRoutines.assignees'],
            where: { id: designThinkingActivityId },
        });
        if (designThinkingActivity === null) {
            throw Error('designThinkingActivityId not exist');
        } else {
            return designThinkingActivity;
        }
    }

    async findDesignThinkingActivityForUser(userId: number): Promise<DTActivityEntity[]> {
        // const designThinkingActivity = await AppDataSource.createQueryBuilder(DTActivityEntity, 'DTActivityEntity')
        //     .leftJoinAndSelect('DTActivityEntity.stages', 'stage').leftJoinAndSelect('stage.subStages', 'subStage')
        //     .where('DTActivityEntity.id = :id', { id: designThinkinActivityId }).getOne();
        const designThinkingActivities = await this.DTArepository.createQueryBuilder('designThinkingActivity')
            .leftJoinAndSelect('designThinkingActivity.users', 'user')
            .where('user.id = :userId', { userId })
            .getMany();

        if (designThinkingActivities.length === 0) {
            throw Error('the user do not have any designThinkingActivity!');
        } else {
            return designThinkingActivities;
        }
    }
}

const thinkingRoutines = [
    {
        thinkingRoutineName: "列出利害關係人",
        thinkingRoutineType: "發散",
        assignees: ["yihong", "houl", "ru", "kang"],
        hint: "請列出你心目中的利害關係人",
        needChecked: true,
        belongColumn: "進行中",
        index: 5
    },
    {
        thinkingRoutineName: "列出利害關係人",
        thinkingRoutineType: "發散",
        assignees: ["yihong", "houl", "ru", "kang"],
        hint: "請列出你心目中的利害關係人",
        needChecked: true,
        belongColumn: "進行中",
        index: 4
    },
    {
        thinkingRoutineName: "列出利害關係人",
        thinkingRoutineType: "發散",
        assignees: ["yihong", "houl", "ru", "kang"],
        hint: "請列出你心目中的利害關係人",
        needChecked: true,
        belongColumn: "進行中",
        index: 3
    },
    {
        thinkingRoutineName: "列出利害關係人",
        thinkingRoutineType: "發散",
        assignees: ["yihong", "houl", "ru", "kang"],
        hint: "請列出你心目中的利害關係人",
        needChecked: true,
        belongColumn: "進行中",
        index: 2
    },
    {
        thinkingRoutineName: "歸納利害關係人",
        thinkingRoutineType: "歸納",
        assignees: ["yihong", "houl", "ru", "kang"],
        hint: "請將類型相似的利害關係人貼上標籤",
        needChecked: true,
        belongColumn: "進行中",
        index: 6
    },
    {
        thinkingRoutineName: "列出利害關係人-小組",
        thinkingRoutineType: "發散",
        assignees: ["yihong", "houl", "ru", "kang"],
        hint: "請以小組為單位列出利害關係人",
        needChecked: true,
        belongColumn: "進行中",
        index: 1
    },
    {
        thinkingRoutineName: "自我介紹",
        thinkingRoutineType: "發散",
        assignees: ["yihong", "houl", "ru", "kang"],
        hint: "請說出自己的特質",
        needChecked: false,
        belongColumn: "進行中",
        index: 0
    }
]

const nodes = [
    {
        title: "自我介紹",
        content: "請大家依照自我介紹節點延伸出的：特質、三個形容詞、最能形容自己的三件事，來做自我介紹",
        owner: "yihong",
    },
    {
        title: "特質",
        content: "請大家以此延伸出自己的特質",
        owner: "yihong",
    },
    {
        id: 3,
        title: "三件事形容自己",
        content: "請大家列出形容自己的三件事",
        owner: "yihong",
        to: 1
    },
    {
        id: 4,
        title: "三個形容詞",
        content: "請大家列出形容自己的三件事",
        owner: "yihong",
        to: 1
    }
];