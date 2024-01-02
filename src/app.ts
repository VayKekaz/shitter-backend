import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { httpMiddleware } from '@deepkit/http';
import { Env } from './app/config';
import { ShitterDatabase } from './datasource/database';
import { authProvider } from './users/authProvider';
import { UsersController } from './users/controller';
import { CorsEventListener, corsMiddleware } from './util/CorsEventListener';


const app = new App({
    config: Env,
    controllers: [
        UsersController,
    ],
    providers: [
        ShitterDatabase,
        authProvider,
    ],
    middlewares: [
        httpMiddleware.for(corsMiddleware),
    ],
    listeners: [CorsEventListener],
    imports: [new FrameworkModule({
        debug: true,
        migrateOnStartup: true,
        broker: { startOnBootstrap: false },
    })],
});

app.loadConfigFromEnv({
    envFilePath: ['production.env', '.env'],
    namingStrategy: 'upper',
    prefix: '',
});

app.setup((module, config: Env) => {
    if (config.environment === 'production') {
        //enable logging JSON messages instead of formatted strings
        // module.setupGlobalProvider<Logger>().setTransport([new JSONTransport]);

        //disable debugging
        module.getImportedModuleByClass(FrameworkModule).configure({ debug: false });
    }
});

app.run();
