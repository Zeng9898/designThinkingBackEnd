import { Post } from '../domain/Post';
import { PostRepository } from '../web/repository/PostRepository';

// 傳入此 use case 需要的 request 格式
export class CreatePostUseCase {
    constructor(private readonly postRepository: PostRepository) { }

    async execute(post: Post): Promise<Post> {
        return this.postRepository.create(post);
    }
}
