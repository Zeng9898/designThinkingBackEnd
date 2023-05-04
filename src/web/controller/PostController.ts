import { Request, Response } from 'express';
import { CreatePostUseCase } from '../../application/CreatePostUseCase';
import { Post } from '../../domain/Post';
import { PostRepositoryImpl } from '../repository/PostRepository';

export class PostController {
  async createPost(req: Request, res: Response): Promise<void> {
    try {
        const { title, content, date } = req.body;
        const post = new Post(title, content, date);
        const postRepository = new PostRepositoryImpl();
        const createPostUseCase = new CreatePostUseCase(postRepository);
        const createdPost = await createPostUseCase.execute(post);
        res.status(201).json(createdPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}