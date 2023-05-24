import { UserEntity } from '../entity/UserEntity';
import { AppDataSource } from "../TypeORMConfig";
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//dotenv.config();

export interface UserRepository {
    register(nickname: string, username: string, password: string): Promise<UserEntity>;
    findOneByUsername(username: string): Promise<UserEntity | null>;
    login(userId: number, nickname: string, usernameParam: string, password: string, hashedPassword: string): Promise<object>;
}

export class UserRepositoryImpl implements UserRepository {
    private readonly userRepository: Repository<UserEntity>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }

    async register(nickname: string, username: string, password: string): Promise<UserEntity> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserEntity(nickname, username, hashedPassword);
        const createdUser = await this.userRepository.save(newUser);
        console.log(createdUser);
        return {
            id: createdUser.id,
            nickname: createdUser.nickname,
            username: createdUser.username,
            password: createdUser.password
        };
    }

    async findOneByUsername(username: string): Promise<UserEntity | null> {
        return await this.userRepository.findOneBy({ username: username })
    }

    async login(userId: number, nickname: string, usernameParam: string, password: string, hashedPassword: string): Promise<object> {
        if (await bcrypt.compare(password, hashedPassword)) {
            const username = usernameParam;
            const user = { id: userId, name: username };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '30s' })
            console.log('secret', process.env.ACCESS_TOKEN_SECRET)
            console.log('accessToken', accessToken);
            return /*accessToken*/{ accessToken: accessToken, userId: userId, nickname: nickname };
        } else {
            throw Error('密碼錯誤');
        }
    }
}