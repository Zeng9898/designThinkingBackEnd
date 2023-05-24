import { Request, Response } from 'express';
import { DesignThinkingActivityUseCases } from '../../application/DesignThinkinActivityUseCases';

export class DesignThinkingActivityController {
    constructor(public readonly designThinkingActivityUseCases: DesignThinkingActivityUseCases) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { designThinkingActivityName } = req.body;
            if (!designThinkingActivityName) {
                res.status(400).send('missing parameter');
                return;
            }
            await this.designThinkingActivityUseCases.createDesignThinkingActivity(designThinkingActivityName);
            res.status(201).json(/*createdDesignThinkingActivity*/{ message: "test OK" });
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).send("unknown error");
            }
        }
    }

    async joinUser(req: Request, res: Response): Promise<void> {
        try {
            const { username } = req.body;
            const designThinkingActivityId = parseInt(req.params.designThinkingActivityId, 10);
            if (isNaN(designThinkingActivityId)) {
                res.status(400).send("url parameter not a number");
                return;
            }
            if (!username || !designThinkingActivityId) {
                res.status(400).send('missing parameter');
                return;
            }
            await this.designThinkingActivityUseCases.joinUser(username, designThinkingActivityId);
            res.status(201).json(/*createdDesignThinkingActivity*/{ message: "test OK" });
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).send("unknown error");
            }
        }
    }

    async read(req: Request, res: Response): Promise<void> {
        try {
            const designThinkingActivityId = parseInt(req.params.designThinkingActivityId, 10);
            if (isNaN(designThinkingActivityId)) {
                res.status(400).send("url parameter not a number");
                return;
            }
            const designThinkingActivity = await this.designThinkingActivityUseCases.read(designThinkingActivityId);
            res.status(201).send(/*createdDesignThinkingActivity*/designThinkingActivity);
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).send("unknown error");
            }
        }
    }
}