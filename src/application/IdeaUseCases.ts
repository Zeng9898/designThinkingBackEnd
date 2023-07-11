import { UserRepository } from "../web/repository/UserRepository";
import { UserEntity } from "../web/entity/UserEntity";
import { IdeaRepository } from "../web/repository/IdeaRepository";
import { IdeaEntity } from "../web/entity/IdeaEntity";
// 傳入此 use case 需要的 request 格式
export class IdeaUseCases {
    constructor(private readonly ideaRepository: IdeaRepository) { } //傳入UserReposityImpl

    async create(title: string, owner: string, thinkingRoutineId: string, content: string, to:number): Promise<IdeaEntity> {
        console.log(thinkingRoutineId)
        const createdIdea = await this.ideaRepository.create(title, owner, thinkingRoutineId, content, to);
        return createdIdea;
    }
}
