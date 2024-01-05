import { AutoIncrement, BackReference, entity, MaxLength, MinLength, PrimaryKey, Reference } from '@deepkit/type';
import { Provider } from '@vaykekaz/di-container';
import { ThreadPost } from '../posts/model';
import { ShitterUser } from '../users/model';


@Provider('dbEntity')
@entity.name('shitter_thread')
export class ShitterThread {
    id: number & PrimaryKey & AutoIncrement = -1;
    created: Date = new Date();

    posts: Array<ThreadPost> & BackReference = [];

    constructor(
        public author: ShitterUser & Reference,
        public title: string & MinLength<3> & MaxLength<255>,
        public content: string & MaxLength<1023> = '',
    ) {
    }
}
