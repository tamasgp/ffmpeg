import { Router } from 'express';
import { JobController } from '../controllers/jobController';

export function createJobRouter(): Router {
  const router = Router();
  const controller = new JobController();

  router.get('/', controller.getAll);
  router.get('/transcoder/:id/logs', controller.getLogs);
  router.get('/:id', controller.getById);

  return router;
}
