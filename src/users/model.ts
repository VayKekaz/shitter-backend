import { AutoIncrement, BackReference, entity, Excluded, MaxLength, PrimaryKey, Unique } from '@deepkit/type';
import { Provider } from '@vaykekaz/di-container';
import { compare, hash } from 'bcrypt';
import { ThreadPost } from '../posts/model';
import { ShitterThread } from '../threads/model';


@Provider('dbEntity')
@entity.name('shitter_user')
export class ShitterUser {
    id: number & PrimaryKey & AutoIncrement = 0;

    threads: Array<ShitterThread> & BackReference = [];
    posts: Array<ThreadPost> & BackReference = [];

    constructor(
        public username: string & Unique & MaxLength<31>,
        public pwhash: string & MaxLength<60> & Excluded<'json'>,
    ) {
    }

    static async create(username: ShitterUser['username'], password: string): Promise<ShitterUser> {
        return new ShitterUser(
            username,
            await hash(password, 10),
        );
    }

    isCorrectPassword(password: string): Promise<boolean> {
        return compare(password, this.pwhash);
    }
}
