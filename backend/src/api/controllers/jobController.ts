import { Request, Response } from 'express';
import { AppDataSource } from '../../database/dataSource';
import { Job } from '../../database/entities/Job';
import { TranscoderLog } from '../../database/entities/TranscoderLog';
import { logger } from '../../utils/logger';

export class JobController {
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const repo = AppDataSource.getRepository(Job);
      const where = req.query.transcoderId
        ? { transcoderId: req.query.transcoderId as string }
        : undefined;
      const jobs = await repo.find({
        where,
        order: { createdAt: 'DESC' },
        take: 100,
      });
      res.json(jobs);
    } catch (error) {
      logger.error('Failed to get jobs', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const repo = AppDataSource.getRepository(Job);
      const job = await repo.findOne({ where: { id: req.params.id } });
      if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }
      res.json(job);
    } catch (error) {
      logger.error('Failed to get job', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getLogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const logRepo = AppDataSource.getRepository(TranscoderLog);
      const logs = await logRepo.find({
        where: { transcoderId: req.params.id },
        order: { createdAt: 'DESC' },
        take: 200,
      });
      res.json(logs);
    } catch (error) {
      logger.error('Failed to get logs', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
