import { Request, Response } from 'express';
import { UserUseCases } from '../../application/UserUseCases';

export class UserController {
    constructor(public readonly userUseCases: UserUseCases) { }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { nickname, username, password, passwordConfirmation } = req.body;
            if (!nickname || !username || !password || !passwordConfirmation) {
                res.status(400).send('missing parameter');
                return;
            }
            const createdUser = await this.userUseCases.register(nickname ,username, password, passwordConfirmation);
            res.status(201).json(createdUser);
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).send("unknown error");
            }
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                res.status(400).send('缺少欄位');
                return;
            }
            const accessTokenAndUserInfo = await this.userUseCases.login(username, password);
            res.status(201).json(accessTokenAndUserInfo);
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).send("unknown error");
            }
        }
    }
}