import { Router } from 'express';
import { createTranscoderRouter } from './transcoders';
import { createAbrTemplateRouter } from './abrTemplates';
import { createJobRouter } from './jobs';
import { WebSocketService } from '../../services/websocket/websocketService';

export function createApiRouter(wsService: WebSocketService): Router {
  const router = Router();

  router.use('/transcoders', createTranscoderRouter(wsService));
  router.use('/abr-templates', createAbrTemplateRouter());
  router.use('/jobs', createJobRouter());

  return router;
}
