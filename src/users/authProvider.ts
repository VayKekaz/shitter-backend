import { HttpRequest } from '@deepkit/http';
import { ProviderProvide } from '@deepkit/injector';
import * as jwt from 'jsonwebtoken';
import { Env } from '../app/config';
import { ShitterUser } from './model';


export const authProvider = <ProviderProvide<ShitterUser>>{
    provide: ShitterUser,
    scope: 'http',
    useFactory: (req: HttpRequest, secret: Env['jwtSecret']): ShitterUser | null => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.match(/^Bearer (.+)$/)?.[1];

        if (token)
            return jwt.verify(token, secret) as ShitterUser;
        return null;
    },
};
