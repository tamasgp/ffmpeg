import { Router } from 'express';
import { TranscoderController } from '../controllers/transcoderController';
import { FfmpegService } from '../../services/ffmpeg/ffmpegService';
import { WebSocketService } from '../../services/websocket/websocketService';

export function createTranscoderRouter(wsService: WebSocketService): Router {
  const router = Router();
  const ffmpegService = new FfmpegService(wsService);
  const controller = new TranscoderController(ffmpegService);

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);
  router.post('/:id/start', controller.start);
  router.post('/:id/stop', controller.stop);

  return router;
}
