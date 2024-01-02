import { Database } from '@deepkit/orm';
import { PostgresDatabaseAdapter } from '@deepkit/postgres';
import { Env } from '../app/config';
import { ShitterUser } from '../users/model';


export class ShitterDatabase extends Database {

    constructor(env: Env) {
        super(
            new PostgresDatabaseAdapter({
                user: env.postgresUser,
                password: env.postgresPassword,
                database: env.postgresDb,
                host: env.postgresHost,
                port: env.postgresPort,
            }),
            [
                ShitterUser,
            ],
        );
    }
}
