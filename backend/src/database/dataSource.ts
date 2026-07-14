import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Transcoder } from './entities/Transcoder';
import { AbrTemplate } from './entities/AbrTemplate';
import { Stream } from './entities/Stream';
import { Job } from './entities/Job';
import { TranscoderLog } from './entities/TranscoderLog';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || '******localhost:5432/ffmpeg_manager',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [Transcoder, AbrTemplate, Stream, Job, TranscoderLog],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});
