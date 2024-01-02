import { eventDispatcher } from '@deepkit/event';
import { httpWorkflow } from '@deepkit/http';
import cors from 'cors';


export const corsMiddleware = cors();

export class CorsEventListener {
    @eventDispatcher.listen(httpWorkflow.onRouteNotFound)
    onRouteNotFound(event: typeof httpWorkflow.onRouteNotFound.event) {
        return corsMiddleware(event.request, event.response, event.next);
    }
}
