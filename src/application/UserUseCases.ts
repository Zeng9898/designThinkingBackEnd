import { UserRepository } from "../web/repository/UserRepository";
import { UserEntity } from "../web/entity/UserEntity";
// 傳入此 use case 需要的 request 格式
export class UserUseCases {
    constructor(private readonly userRepository: UserRepository) { } //傳入UserReposityImpl

    async register(nickname: string, username: string, password: string, passwordConfirmation: string): Promise<UserEntity> {
        const existingUser = await this.userRepository.findOneByUsername(username);
        if (existingUser) throw new Error("Username already exists");
        if (password !== passwordConfirmation) throw new Error("password is not equal to confirm password");
        return await this.userRepository.register(nickname, username, password);
    }
    async login(username: string, password: string): Promise<object> {
        const existingUser = await this.userRepository.findOneByUsername(username);
        if (!existingUser) throw new Error("帳號不存在");
        const accessTokenAndUserInfo = await this.userRepository.login(existingUser.id!, existingUser.nickname, username, password, existingUser.password);
        return accessTokenAndUserInfo;
    }
}
