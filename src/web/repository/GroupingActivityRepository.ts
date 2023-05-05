import { GroupingActivityEntity } from "../entity/GroupingActivityEntity";
import { AppDataSource } from "../TypeORMConfig";
import { Repository } from 'typeorm';

export interface GroupingActivityRepository {
    create(groupingActivity: GroupingActivityEntity): Promise<GroupingActivityEntity>;
}

export class GroupingActivityRepositoryImpl implements GroupingActivityRepository {
    private readonly repository: Repository<GroupingActivityEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(GroupingActivityEntity);
    }

    async create(groupingActivity: GroupingActivityEntity): Promise<GroupingActivityEntity> {
        const createdGroupingActivity = await this.repository.save(groupingActivity);
        console.log(createdGroupingActivity);
        return {
            id: createdGroupingActivity.id,
            groupingActivityName: createdGroupingActivity.groupingActivityName,
            isSupervised: createdGroupingActivity.isSupervised,
            supervisorInvitationCode: createdGroupingActivity.supervisorInvitationCode,
            invitationCode: createdGroupingActivity. invitationCode
        };
    }
}