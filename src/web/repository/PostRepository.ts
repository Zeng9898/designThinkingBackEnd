import { PostEntity } from "../entity/PostEntity";
import { Post } from "../../domain/Post";
import { AppDataSource } from "../TypeORMConfig";
import { Repository } from 'typeorm';

export interface PostRepository {
    create(post: Post): Promise<Post>;
}

export class PostRepositoryImpl implements PostRepository {
    private readonly repository: Repository<Post>;

    constructor() {
        this.repository = AppDataSource.getRepository(PostEntity);
    }

    async create(post: Post): Promise<Post> {
        const createdPost = await this.repository.save(post);
        return {
            id: createdPost.id,
            content: createdPost.content,
            title: createdPost.title,
            date: createdPost.date,
        };
    }
}