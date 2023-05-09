import { Request, Response } from 'express';
import { CreateGroupingActivityUseCase } from '../../application/CreateGropingActivityUseCase';
import { GroupingActivityEntity } from '../entity/GroupingActivityEntity';
import { GroupingActivityRepositoryImpl } from '../repository/GroupingActivityRepository';

export class GroupingActitityController {
  async createGroupingActivity(req: Request, res: Response): Promise<void> {
    try {
      const { groupingActivityName, isSupervised, supervisorInvitationCode, invitationCode } = req.body;
      const groupingActivity = new GroupingActivityEntity(groupingActivityName, isSupervised, supervisorInvitationCode, invitationCode);
      const groupingActivityRepository = new GroupingActivityRepositoryImpl();
      const createGroupingActivityUseCase = new CreateGroupingActivityUseCase(groupingActivityRepository);
      const createdGroupingActivity = await createGroupingActivityUseCase.execute(groupingActivity);
      res.status(201).json(createdGroupingActivity);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}