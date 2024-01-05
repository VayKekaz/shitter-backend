import { http, HttpAccessDeniedError, HttpBody, HttpQueries } from '@deepkit/http';
import { Database } from '@deepkit/orm';
import { Provider } from '@vaykekaz/di-container';
import { ShitterThread } from '../threads/model';
import { ShitterUser } from '../users/model';
import { ThreadPost } from './model';


@http.controller('/threads/:threadId/posts')
@Provider('controller')
export class PostsController {

    constructor(
        private readonly db: Database,
    ) {
    }

    @http.GET()
    async getPosts(
        threadId: ShitterThread['id'],
        { from = new Date(0) }: HttpQueries<{ from?: Date }>,
    ): Promise<Array<ThreadPost>> {
        return this.db.query(ThreadPost)
            .orderBy('created', 'asc')
            .filter({ created: { $gt: from } })
            .find();
    }

    @http.POST()
    async createThread(
        threadId: ShitterThread['id'],
        body: HttpBody<{
            content: ThreadPost['content']
        }>,
        user?: ShitterUser,
    ): Promise<ThreadPost> {
        if (!user)
            throw new HttpAccessDeniedError('You must be signed in to create a post.');

        const created = new ThreadPost(
            await this.db.query(ShitterThread).filter({ id: threadId }).findOne(),
            await this.db.query(ShitterUser).filter({ id: user.id }).findOne(),
            body.content,
        );

        const session = this.db.createSession();
        session.add(created);
        await session.commit();

        return created;
    }
}

@http.controller('/users/:userId/posts')
@Provider('controller')
export class UserPostsController {

    constructor(
        private readonly db: Database,
    ) {
    }

    @http.GET()
    async getPostsOfUser(userId: ShitterUser['id']): Promise<Array<ThreadPost>> {
        return this.db.query(ThreadPost)
            .useInnerJoin('author')
            .filter({ id: userId })
            .end()
            .find();
    }
}
