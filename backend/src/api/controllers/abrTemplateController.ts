import { Request, Response } from 'express';
import { AppDataSource } from '../../database/dataSource';
import { AbrTemplate } from '../../database/entities/AbrTemplate';
import { logger } from '../../utils/logger';

export class AbrTemplateController {
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const repo = AppDataSource.getRepository(AbrTemplate);
      const templates = await repo.find({ order: { createdAt: 'DESC' } });
      res.json(templates);
    } catch (error) {
      logger.error('Failed to get ABR templates', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const repo = AppDataSource.getRepository(AbrTemplate);
      const template = await repo.findOne({ where: { id: req.params.id } });
      if (!template) {
        res.status(404).json({ error: 'ABR template not found' });
        return;
      }
      res.json(template);
    } catch (error) {
      logger.error('Failed to get ABR template', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const repo = AppDataSource.getRepository(AbrTemplate);
      const template = repo.create(req.body);
      await repo.save(template);
      res.status(201).json(template);
    } catch (error) {
      logger.error('Failed to create ABR template', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const repo = AppDataSource.getRepository(AbrTemplate);
      const template = await repo.findOne({ where: { id: req.params.id } });
      if (!template) {
        res.status(404).json({ error: 'ABR template not found' });
        return;
      }
      repo.merge(template, req.body);
      await repo.save(template);
      res.json(template);
    } catch (error) {
      logger.error('Failed to update ABR template', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const repo = AppDataSource.getRepository(AbrTemplate);
      const template = await repo.findOne({ where: { id: req.params.id } });
      if (!template) {
        res.status(404).json({ error: 'ABR template not found' });
        return;
      }
      await repo.remove(template);
      res.status(204).send();
    } catch (error) {
      logger.error('Failed to delete ABR template', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
