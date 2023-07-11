import { Request, Response } from 'express';
import { DesignThinkingActivityUseCases } from '../../application/DesignThinkinActivityUseCases';

export class DesignThinkingActivityController {
    constructor(public readonly designThinkingActivityUseCases: DesignThinkingActivityUseCases) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { designThinkingActivityName, designThinkingActivityDescription, leaderId } = req.body;
            console.log("createActivity")
            console.log(designThinkingActivityName, designThinkingActivityDescription, leaderId);
            if (!designThinkingActivityName || !designThinkingActivityDescription || !leaderId) {
                res.status(400).send('missing designThinkingActivityName or designThinkinActivityDescription parameter or leaderId');
                return;
            }
            const designThinkingActivity = await this.designThinkingActivityUseCases.createDesignThinkingActivity(designThinkingActivityName, designThinkingActivityDescription, leaderId);
            res.status(201).json(/*createdDesignThinkingActivity*/{ message: "create design thinking activity successfully", designThinkingActivity: designThinkingActivity });
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
                res.status(400).send("url parameter for designThinkingActivity not a number");
                return;
            }
            if (!username || !designThinkingActivityId) {
                res.status(400).send('missing username or designThinkingActivityId parameter');
                return;
            }
            const designThinkinActivity = await this.designThinkingActivityUseCases.joinUser(username, designThinkingActivityId);
            res.status(201).json(/*createdDesignThinkingActivity*/{ message: "join user successfully!", designThinkingActivity: designThinkinActivity });
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
                res.status(400).send("url parameter for designThinkingActivity not a number");
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

    async findDesignThinkingActivityForUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId, 10);
            if (isNaN(userId)) {
                res.status(400).send("url parameter for userId not a number");
                return;
            }
            const designThinkingActivities = await this.designThinkingActivityUseCases.findDesignThinkingActivityForUser(userId);
            res.status(201).send(/*createdDesignThinkingActivity*/designThinkingActivities);
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).send("unknown error");
            }
        }
    }
}