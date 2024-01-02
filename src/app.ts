import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { JSONTransport, Logger } from '@deepkit/logger';
import { Env } from './app/config';
import { ShitterDatabase } from './datasource/database';
import { authProvider } from './users/authProvider';
import { UsersController } from './users/controller';


const app = new App({
    config: Env,
    controllers: [
        UsersController,
    ],
    providers: [
        ShitterDatabase,
        authProvider,
    ],
    imports: [new FrameworkModule({
        debug: true,
        migrateOnStartup: true,
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
        module.setupGlobalProvider<Logger>().setTransport([new JSONTransport]);

        //disable debugging
        module.getImportedModuleByClass(FrameworkModule).configure({ debug: false });
    }
});

app.run();
