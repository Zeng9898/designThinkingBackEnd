import { DesignThinkingActivityRepository } from "../web/repository/DesignThinkingActivityRepository";
// 傳入此 use case 需要的 request 格式
export class DesignThinkingActivityUseCases {
    constructor(private readonly designThinkingRepository: DesignThinkingActivityRepository) { }

    //constructor(private readonly userRepository: UserRepository) { } //傳入UserReposityImpl

    async createDesignThinkingActivity(designThinkingActivityName: string): Promise<void> {
        const designThinkingActivity = await this.designThinkingRepository.create(designThinkingActivityName);
        return designThinkingActivity
    }

    async joinUser(username: string, designThinkinActivityId: number): Promise<void> {
        const joinMessage = await this.designThinkingRepository.joinUser(username, designThinkinActivityId);
        return joinMessage;
    }

    async read(designThinkinActivityId: number): Promise<object> {
        const designThinkingActivity = await this.designThinkingRepository.read(designThinkinActivityId);
        return designThinkingActivity;
    }
}
