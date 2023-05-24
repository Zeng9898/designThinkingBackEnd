import { DesignThinkingActivityRepository } from "../web/repository/DesignThinkingActivityRepository";
import { DTActivityEntity } from "../web/entity/DTActivityEntity";
// 傳入此 use case 需要的 request 格式
export class DesignThinkingActivityUseCases {
    constructor(private readonly designThinkingActivityRepository: DesignThinkingActivityRepository) { }

    //constructor(private readonly userRepository: UserRepository) { } //傳入UserReposityImpl

    async createDesignThinkingActivity(designThinkingActivityName: string): Promise<DTActivityEntity> {
        const designThinkingActivity = await this.designThinkingActivityRepository.create(designThinkingActivityName);
        return designThinkingActivity
    }

    async joinUser(username: string, designThinkinActivityId: number): Promise<DTActivityEntity> {
        const dtActivity = await this.designThinkingActivityRepository.joinUser(username, designThinkinActivityId);
        return dtActivity;
    }

    async read(designThinkinActivityId: number): Promise<DTActivityEntity> {
        const designThinkingActivity = await this.designThinkingActivityRepository.read(designThinkinActivityId);
        return designThinkingActivity;
    }

    async findDesignThinkingActivityForUser(userId: number): Promise<DTActivityEntity[]> {
        const designThinkingActivities = await this.designThinkingActivityRepository.findDesignThinkingActivityForUser(userId);
        return designThinkingActivities;
    }
    
}
