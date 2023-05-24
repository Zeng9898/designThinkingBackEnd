import { ThinkingRoutineEntity } from "../web/entity/ThinkingRoutineEntity";
import { ThinkingRoutineRepository } from "../web/repository/ThinkingRoutineRepository";
// 傳入此 use case 需要的 request 格式
export class ThinkingRoutineUseCases {
    constructor(private readonly thinkingRoutineRepository: ThinkingRoutineRepository) { }

    //constructor(private readonly userRepository: UserRepository) { } //傳入UserReposityImpl

    async read(thinkingRoutineId: number): Promise<ThinkingRoutineEntity> {
        const thinkingRoutine = await this.thinkingRoutineRepository.read(thinkingRoutineId);
        return thinkingRoutine;
    }
}
