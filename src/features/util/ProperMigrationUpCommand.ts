import { cli, Command } from '@deepkit/app';
import { indent } from '@deepkit/core';
import { Logger } from '@deepkit/logger';
import { Database } from '@deepkit/orm';
import { PostgresDatabaseAdapter } from '@deepkit/postgres';
import { MigrationProvider, SqlMigrationHandler } from '@deepkit/sql';
import { Provider } from '@vaykekaz/di-container';


@Provider('controller')
@cli.controller('migration:up-all', {
    description: 'Executes pending migration files. Use migration:pending to see which are pending.',
})
export class ProperMigrationUpCommand implements Command {
    private readonly db: Database<PostgresDatabaseAdapter>;

    constructor(
        private readonly logger: Logger,
        private readonly provider: MigrationProvider,
        db: Database,
    ) {
        if (!(db.adapter instanceof PostgresDatabaseAdapter))
            throw new Error('Not a postgres database adapter');

        this.db = db as Database<PostgresDatabaseAdapter>;
    }

    async execute(): Promise<void> {
        const allMigrations = await this.provider.getMigrations(this.provider.getMigrationDir());

        const migrationHandler = new SqlMigrationHandler(this.db);
        const latestVersion = await migrationHandler.getLatestMigrationVersion();
        const migrationsToApply = allMigrations.filter(v => v.version > latestVersion);

        if (migrationsToApply.length < 1) {
            this.logger.log('<green>All migrations executed</green>');
            return;
        }

        const session = this.db.createSession();
        const connection = await this.db.adapter.connectionPool.getConnection(
            undefined,
            session.useTransaction(),
        );

        try {

            for (const migration of migrationsToApply) {
                this.logger.log(`    Migration up <yellow>${migration.name}</yellow>`);
                let i = 1;
                for (const statement of migration.up()) {
                    this.logger.log(`<yellow>    ${i++}. ${indent(4)(statement)}</yellow>`);
                    await connection.run(statement);
                }
                await migrationHandler.setLatestMigrationVersion(migration.version);
            }
            await session.commit();

        } catch (e) {
            this.logger.error('Error migrating database:', e);
            await session.rollback();
        }

        this.logger.log('<green>All migrations executed</green>');
    }
}
