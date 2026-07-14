import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JobStatus } from '../../types';
import { Transcoder } from './Transcoder';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, name: 'transcoder_id' })
  transcoderId!: string;

  @Column({ type: 'varchar', length: 20 })
  status!: JobStatus;

  @Column({ type: 'text', name: 'ffmpeg_command', nullable: true })
  ffmpegCommand?: string;

  @Column({ type: 'int', name: 'pid', nullable: true })
  pid?: number;

  @Column({ type: 'timestamp', name: 'started_at', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', name: 'ended_at', nullable: true })
  endedAt?: Date;

  @Column({ type: 'int', name: 'exit_code', nullable: true })
  exitCode?: number;

  @Column({ type: 'text', name: 'error_message', nullable: true })
  errorMessage?: string;

  @Column({ type: 'jsonb', nullable: true })
  metrics?: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Transcoder, (transcoder) => transcoder.jobs)
  @JoinColumn({ name: 'transcoder_id' })
  transcoder!: Transcoder;
}
