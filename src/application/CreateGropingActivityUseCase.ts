import { GroupingActivityEntity } from "../web/entity/GroupingActivityEntity";
import { GroupingActivityRepository } from "../web/repository/GroupingActivityRepository";

// 傳入此 use case 需要的 request 格式
export class CreateGroupingActivityUseCase {
    constructor(private readonly groupingActivityRepository: GroupingActivityRepository) { }

    async execute(groupingActivity: GroupingActivityEntity): Promise<GroupingActivityEntity> {
        return this.groupingActivityRepository.create(groupingActivity);
    }
}
