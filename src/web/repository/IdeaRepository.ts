import { IdeaEntity } from '../entity/ideaEntity';
import { AppDataSource } from "../TypeORMConfig";
import { Repository } from 'typeorm';
import { ThinkingRoutineEntity } from '../entity/ThinkingRoutineEntity';
import { UserEntity } from '../entity/UserEntity';
//dotenv.config();

export interface IdeaRepository {
    create(title: string, owner: string, thinkingRoutineId: string, content: string, to: number): Promise<IdeaEntity>;
}

export class IdeaRepositoryImpl implements IdeaRepository {
    private readonly ideaRepository: Repository<IdeaEntity>;
    private readonly thinkingRoutineRepository: Repository<ThinkingRoutineEntity>;
    private readonly userRepository: Repository<UserEntity>;

    constructor() {
        this.ideaRepository = AppDataSource.getRepository(IdeaEntity);
        this.thinkingRoutineRepository = AppDataSource.getRepository(ThinkingRoutineEntity);
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }

    async create(title: string, owner: string, thinkingRoutineId: string, content: string, to: number): Promise<IdeaEntity> {
        console.log('before convert', thinkingRoutineId)
        const routineId = parseInt(thinkingRoutineId, 10);
        console.log('after convert', routineId)

        if (isNaN(routineId)) {
            throw Error('thinking routine id cannot be convert to number!');
        }
        console.log(title, owner, )
        const user = await this.userRepository.findOneBy({ nickname: owner })
        const thinkingRoutine = await this.thinkingRoutineRepository.findOneBy({ id: routineId })
        const toIdea = await this.ideaRepository.findOneBy({ id: to })
        console.log(to, toIdea);
        if (user && thinkingRoutine) {
            const newIdea = new IdeaEntity(title, content, user);
            newIdea.thinkingRoutineEntity = thinkingRoutine;
            if (toIdea) {
                newIdea.to = newIdea.to|| [];
                newIdea.to.push(toIdea);
            }
            const createdIdea = await this.ideaRepository.save(newIdea);
            console.log('created', createdIdea);
            return createdIdea;
        } else {
            throw Error('owner or thinkingRoutineId or toUser not exist');
        }

    }


    // async register(username: string, password: string): Promise<UserEntity> {
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     const newUser = new UserEntity(username, hashedPassword);
    //     const createdUser = await this.repository.save(newUser);
    //     console.log(createdUser);
    //     return {
    //         id: createdUser.id,
    //         username: createdUser.username,
    //         password: createdUser.password
    //     };
    // }

    // async findOneByUsername(username: string): Promise<UserEntity | null> {
    //     return await this.repository.findOneBy({ username: username })
    // }

    // async login(userId: number, usernameParam: string, password: string, hashedPassword: string): Promise<string> {
    //     if (await bcrypt.compare(password, hashedPassword)) {
    //         const username = usernameParam;
    //         const user = { id: userId, name: username };
    //         const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '30s' })
    //         console.log('secret', process.env.ACCESS_TOKEN_SECRET)
    //         console.log('accessToken', accessToken);
    //         return accessToken;
    //     } else {
    //         throw Error('密碼錯誤');
    //     }
    // }
}