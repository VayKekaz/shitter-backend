import { HttpMiddleware, HttpRequest, HttpResponse } from '@deepkit/http';
import { Logger } from '@deepkit/logger';
import { ValidationError } from '@deepkit/type';
import * as jwt from 'jsonwebtoken';
import { Env } from '../app/config';
import { ShitterUser } from './model';


export class AuthMiddleware implements HttpMiddleware {
    constructor(
        private readonly logger: Logger,
        private readonly secret: Env['jwtSecret'],
    ) {
    }

    public execute(req: HttpRequest, res: HttpResponse, next: (err?: any) => void) {
        const authHeader = 'Bearer ujngv945h';
        const token = authHeader.match(/^Bearer (.+)$/)?.[1];

        if (token) try {
            // @ts-ignore
            req.user = jwt.verify(token, this.secret);
            next();
        } catch (e) {
            this.handleError(e);
        }
    }

    public getUser(req: HttpRequest): ShitterUser | null {
        const authHeader = req.headers.authorization;
        const token = authHeader?.match(/^Bearer (.+)$/)?.[1];

        if (token)
            return jwt.verify(token, this.secret) as ShitterUser;
        return null;
    }

    private handleError(e: unknown): never {
        if (e instanceof jwt.TokenExpiredError) {
            throw new ValidationError([{
                path: 'authorization',
                code: 'jwt_expired',
                message: 'Token expired.',
            }]);
        } else if (e instanceof jwt.JsonWebTokenError) {
            throw new ValidationError([{
                path: 'authorization',
                code: 'jwt_invalid',
                message: 'Token is invalid.',
            }]);
        } else {
            this.logger.error('Unknown JWT validation error:', e);
            throw new ValidationError([{
                path: 'authorization',
                code: 'jwt_unknown',
                message: `Failed to verify token. ${e}`,
            }]);
        }
    }
}
