import { AutoIncrement, entity, MaxLength, MinLength, PrimaryKey, Reference } from '@deepkit/type';
import { Provider } from '@vaykekaz/di-container';
import { ShitterThread } from '../threads/model';
import { ShitterUser } from '../users/model';


@Provider('dbEntity')
@entity.name('thread_post')
export class ThreadPost {
    id: number & PrimaryKey & AutoIncrement = -1;
    created: Date = new Date();

    constructor(
        public thread: ShitterThread & Reference,
        public author: ShitterUser & Reference,
        public content: string & MinLength<1> & MaxLength<511>,
    ) {
    }
}
