import { HttpMiddleware, HttpRequest, HttpResponse } from '@deepkit/http';


export class CorsMiddleware implements HttpMiddleware {
    public async execute(req: HttpRequest, res: HttpResponse, next: (err?: any) => void) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    }
}
