import { Request, Response } from 'express';
import { ThinkingRoutineUseCases } from '../../application/ThinkingRoutineUseCases';

export class ThinkinRoutineController {
    constructor(public readonly thinkingRoutineUseCases: ThinkingRoutineUseCases) { }

    async read(req: Request, res: Response): Promise<void> {
        try {
            const thinkingRoutineId = parseInt(req.params.thinkingRoutineId, 10);
            if (isNaN(thinkingRoutineId)) {
                res.status(400).send("url parameter for thinking routine not a number");
                return;
            }
            const thinkingRoutine = await this.thinkingRoutineUseCases.read(thinkingRoutineId);
            res.status(201).send(/*createdDesignThinkingActivity*/thinkingRoutine);
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).send("unknown error");
            }
        }
    }
}