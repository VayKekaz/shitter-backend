import { HttpRequest, HttpUnauthorizedError } from '@deepkit/http';
import { ProviderProvide } from '@deepkit/injector';
import * as jwt from 'jsonwebtoken';
import { Env } from '../../app/config';
import { ShitterUserDto } from './model';


export class ShitterAuthorization {
    constructor(
        public readonly user: ShitterUserDto | null,
    ) {
    }
}

export const authProvider = <ProviderProvide<ShitterAuthorization>>{
    provide: ShitterAuthorization,
    scope: 'http',
    useFactory: (req: HttpRequest, secret: Env['jwtSecret']): ShitterAuthorization => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.match(/^Bearer (.+)$/)?.[1];

        if (!token)
            return new ShitterAuthorization(null);
        try {
            return new ShitterAuthorization(jwt.verify(token, secret) as ShitterUserDto);
        } catch (e) {
            throw new HttpUnauthorizedError('Token is not valid.');
        }
    },
};
