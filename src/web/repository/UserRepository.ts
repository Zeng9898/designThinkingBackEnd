import { UserEntity } from '../entity/UserEntity';
import { AppDataSource } from "../TypeORMConfig";
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

//dotenv.config();

export interface UserRepository {
    register(username: string, password: string): Promise<UserEntity>;
    findOneByUsername(username: string): Promise<UserEntity | null>;
    login(userId: number, username: string, password: string, hashedPassword: string): Promise<string>;
}

export class UserRepositoryImpl implements UserRepository {
    private readonly repository: Repository<UserEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(UserEntity);
    }

    async register(username: string, password: string): Promise<UserEntity> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserEntity(username, hashedPassword);
        const createdUser = await this.repository.save(newUser);
        console.log(createdUser);
        return {
            id: createdUser.id,
            username: createdUser.username,
            password: createdUser.password
        };
    }

    async findOneByUsername(username: string): Promise<UserEntity | null> {
        return await this.repository.findOneBy({ username: username })
    }

    async login(userId: number, usernameParam: string, password: string, hashedPassword: string): Promise<string> {
        if (await bcrypt.compare(password, hashedPassword)) {
            const username = usernameParam;
            const user = { id: userId, name: username };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '30s' })
            console.log('secret', process.env.ACCESS_TOKEN_SECRET)
            console.log('accessToken',accessToken);
            return accessToken;
        } else {
            throw Error('密碼錯誤');
        }
    }
}