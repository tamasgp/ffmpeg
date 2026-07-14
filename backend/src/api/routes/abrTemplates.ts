import { Router } from 'express';
import { AbrTemplateController } from '../controllers/abrTemplateController';

export function createAbrTemplateRouter(): Router {
  const router = Router();
  const controller = new AbrTemplateController();

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
}
