import { Request, Response } from 'express';
import { AppDataSource } from '../../database/dataSource';
import { Transcoder } from '../../database/entities/Transcoder';
import { TranscoderStatus } from '../../types';
import { FfmpegService } from '../../services/ffmpeg/ffmpegService';
import { logger } from '../../utils/logger';

export class TranscoderController {
  private ffmpegService: FfmpegService;

  constructor(ffmpegService: FfmpegService) {
    this.ffmpegService = ffmpegService;
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const repo = AppDataSource.getRepository(Transcoder);
      const transcoders = await repo.find({ order: { createdAt: 'DESC' } });
      res.json(transcoders);
    } catch (error) {
      logger.error('Failed to get transcoders', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const repo = AppDataSource.getRepository(Transcoder);
      const transcoder = await repo.findOne({ where: { id: req.params.id } });
      if (!transcoder) {
        res.status(404).json({ error: 'Transcoder not found' });
        return;
      }
      res.json(transcoder);
    } catch (error) {
      logger.error('Failed to get transcoder', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const repo = AppDataSource.getRepository(Transcoder);
      const transcoder = repo.create({
        ...req.body,
        status: TranscoderStatus.IDLE,
      });
      await repo.save(transcoder);
      res.status(201).json(transcoder);
    } catch (error) {
      logger.error('Failed to create transcoder', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const repo = AppDataSource.getRepository(Transcoder);
      const transcoder = await repo.findOne({ where: { id: req.params.id } });
      if (!transcoder) {
        res.status(404).json({ error: 'Transcoder not found' });
        return;
      }
      repo.merge(transcoder, req.body);
      await repo.save(transcoder);
      res.json(transcoder);
    } catch (error) {
      logger.error('Failed to update transcoder', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const repo = AppDataSource.getRepository(Transcoder);
      const transcoder = await repo.findOne({ where: { id: req.params.id } });
      if (!transcoder) {
        res.status(404).json({ error: 'Transcoder not found' });
        return;
      }
      await repo.remove(transcoder);
      res.status(204).send();
    } catch (error) {
      logger.error('Failed to delete transcoder', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  start = async (req: Request, res: Response): Promise<void> => {
    try {
      const job = await this.ffmpegService.startTranscoder(req.params.id);
      res.json({ message: 'Transcoder started', job });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start transcoder';
      logger.error('Failed to start transcoder', { error });
      res.status(400).json({ error: message });
    }
  };

  stop = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.ffmpegService.stopTranscoder(req.params.id);
      res.json({ message: 'Transcoder stopped' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to stop transcoder';
      logger.error('Failed to stop transcoder', { error });
      res.status(400).json({ error: message });
    }
  };
}
