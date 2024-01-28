import { ApiConsoleModule } from '@deepkit/api-console-module';
import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { httpMiddleware } from '@deepkit/http';
import { Database } from '@deepkit/orm';
import { PostgresDatabaseAdapter } from '@deepkit/postgres';
import { ProviderScanner } from '@vaykekaz/di-container';
import { Env } from './app/config';
import { authProvider } from './features/users/authProvider';
import { corsMiddleware } from './features/util/CorsEventListener';


(async () => {
    const controllerScanner = await new ProviderScanner({ scanDirectory: __dirname, scope: 'controller' }).init();
    const providerScanner = await new ProviderScanner({ scanDirectory: __dirname, scope: 'provider' }).init();
    const eventListenerScanner = await new ProviderScanner({ scanDirectory: __dirname, scope: 'eventListener' }).init();
    const entityScanner = await new ProviderScanner({ scanDirectory: __dirname, scope: 'dbEntity' }).init();


    const app = new App({

        config: Env,

        controllers: [...controllerScanner.providers],

        providers: [
            ...providerScanner.providers,
            authProvider,
            { // Declared here due to async initialization
                provide: Database,
                useFactory: (env: Env) => new Database(
                    new PostgresDatabaseAdapter({
                        user: env.postgresUser,
                        password: env.postgresPassword,
                        database: env.postgresDb,
                        host: env.postgresHost,
                        port: env.postgresPort,
                    }),
                    [...entityScanner.providers],
                ),
            },
        ],

        middlewares: [
            httpMiddleware.for(corsMiddleware),
        ],

        listeners: [...eventListenerScanner.providers],

        imports: [
            new FrameworkModule({
                debug: true,
                // must be path from project root, i.e. src/migrations
                migrationDir: 'src/migrations',
                broker: { startOnBootstrap: true },
            }),
            new ApiConsoleModule({ path: '/api' }),
        ],

    });

    app.loadConfigFromEnv({
        envFilePath: ['production.env', '.env'],
        namingStrategy: 'upper',
        prefix: '',
    });

    app.setup((module, config: Env) => {
        if (config.environment === 'production') {
            // enable logging JSON messages instead of formatted strings
            // module.setupGlobalProvider<Logger>().setTransport([new JSONTransport]);

            // disable debugging
            module.getImportedModuleByClass(FrameworkModule).configure({ debug: false });
            // disable api docs
            module.getImportedModuleByClass(ApiConsoleModule).configure({ listen: false });
        }
    });

    await app.run();
})();
