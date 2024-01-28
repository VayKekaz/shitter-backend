import { eventDispatcher } from '@deepkit/event';
import { httpWorkflow } from '@deepkit/http';
import { Provider } from '@vaykekaz/di-container';
import cors from 'cors';


export const corsMiddleware = cors();

@Provider('eventListener')
export class CorsEventListener {
    @eventDispatcher.listen(httpWorkflow.onRouteNotFound)
    onRouteNotFound(event: typeof httpWorkflow.onRouteNotFound.event) {
        return corsMiddleware(event.request, event.response, event.next);
    }
}
