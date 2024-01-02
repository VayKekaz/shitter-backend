import { http, HttpBody, HttpUnauthorizedError } from '@deepkit/http';
import { Logger } from '@deepkit/logger';
import { Database } from '@deepkit/orm';
import { MaxLength, serialize } from '@deepkit/type';
import * as jwt from 'jsonwebtoken';
import { Env } from '../app/config';
import { ShitterUser } from './model';


@http.controller('/users')
export class UsersController {

    constructor(
        private readonly logger: Logger,
        private readonly db: Database,
        private readonly secret: Env['jwtSecret'],
    ) {
    }

    @http.POST('/sign-in')
    async register_login(
        dto: HttpBody<{
            username: string & MaxLength<63>
            password: string
        }>,
    ): Promise<{
        user: ShitterUser
        token: string
    }> {
        let user = await this.db.query(ShitterUser)
            .filter({ username: dto.username })
            .findOneOrUndefined();

        if (user) {
            if (!await user.isCorrectPassword(dto.password))
                throw new HttpUnauthorizedError('Incorrect password.');
        } else {
            user = await ShitterUser.create(dto.username, dto.password);

            const session = this.db.createSession();
            session.add(user);
            await session.commit();
        }

        const token = jwt.sign(serialize<ShitterUser>(user), this.secret);
        return { user, token };
    }

    @http.GET()
    getUsers() {
        return this.db.query(ShitterUser).find();
    }

    @http.GET('/me')
    getMe(user: ShitterUser) {
        return user;
    }
}
