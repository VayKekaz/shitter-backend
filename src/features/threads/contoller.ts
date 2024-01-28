import { http, HttpAccessDeniedError, HttpBody, HttpNotFoundError, HttpQueries } from '@deepkit/http';
import { Database } from '@deepkit/orm';
import { Provider } from '@vaykekaz/di-container';
import { ShitterAuthorization } from '../users/authProvider';
import { ShitterUser } from '../users/model';
import { Pagination } from '../util/pagination';
import { ShitterThread } from './model';


@Provider('controller')
@http.controller('/threads')
@http.group('Threads')
export class ThreadsController {

    constructor(
        private readonly db: Database,
    ) {
    }

    @http.GET()
    async getThreads(
        { limit = 10, offset = 0 }: HttpQueries<Partial<Pagination>>,
    ): Promise<Array<ShitterThread>> {
        return this.db.query(ShitterThread)
            .orderBy('created', 'desc')
            .limit(limit ?? 10).skip(offset ?? 0)
            .find();
    }

    @http.GET('/:id')
    async getThread(id: ShitterThread['id']): Promise<ShitterThread> {
        const thread = await this.db.query(ShitterThread)
            .joinWith('posts')
            .findOneOrUndefined();

        if (thread)
            return thread;

        throw new HttpNotFoundError(`Thread with id=${id} not found.`);
    }

    @http.POST()
    async createThread(
        body: HttpBody<{
            title: ShitterThread['title']
            content?: ShitterThread['content']
        }>,
        auth: ShitterAuthorization,
    ): Promise<ShitterThread> {
        if (!auth.user)
            throw new HttpAccessDeniedError('You must be signed in to create a thread.');

        const created = new ShitterThread(
            await this.db.query(ShitterUser).filter({ id: auth.user.id }).findOne(),
            body.title,
            body.content,
        );

        const session = this.db.createSession();
        session.add(created);
        await session.commit();

        return created;
    }
}

@Provider('controller')
@http.controller('/users/:userId/threads')
@http.group('Users', 'Threads')
export class UserThreadsController {

    constructor(
        private readonly db: Database,
    ) {
    }

    @http.GET()
    async getThreadsOfUser(userId: ShitterUser['id']): Promise<Array<ShitterThread>> {
        return this.db.query(ShitterThread)
            .useInnerJoin('author')
            .filter({ id: userId })
            .end()
            .find();
    }
}
