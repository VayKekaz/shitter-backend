import { Migration } from '@deepkit/sql';


/**
 * Schema migration created automatically. You should commit this into your Git repository.
 *
 * You can rename and modify this file as you like, but make sure that 'databaseName' and 'created' are not modified.
 */
export class SchemaMigration implements Migration {
    /**
     * The migration name/title. Defaults to the file name, but can be overwritten here and to give a nice explanation what has been done.
     */
    name = `shitter_user`;

    /**
     * Database name used for this migration. Should usually not be changed.
     * If you change your database names later, you can adjust those here as well to make sure
     * migration files are correctly assigned to the right database connection.
     *
     * Used adapter: "postgres"
     */
    databaseName = 'default';

    /**
     * This version should not be changed since it is used to detect if this migration
     * has been already executed against the database.
     *
     * This version was created at 2024-01-04T14:59:43.220Z.
     */
    version = 1704380383;

    /**
     * SQL queries executed one by one, to apply a migration.
     */
    up() {
        return [
            `CREATE TABLE "shitter_user"
             (
                 "id"       SERIAL,
                 "username" TEXT NOT NULL,
                 "pwhash"   TEXT NOT NULL,
                 PRIMARY KEY ("id")
             )`,
            `CREATE UNIQUE INDEX "UNIQUE_shitter_user__username" ON "shitter_user" ("username")`,
        ];
    }

    /**
     * SQL queries executed one by one, to revert a migration.
     */
    down() {
        return [
            `DROP TABLE "shitter_user"`,
        ];
    }
}
