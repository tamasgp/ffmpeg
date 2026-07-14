import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transcoder } from './Transcoder';

@Entity('transcoder_logs')
export class TranscoderLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, name: 'transcoder_id' })
  transcoderId!: string;

  @Column({ type: 'varchar', length: 36, name: 'job_id', nullable: true })
  jobId?: string;

  @Column({ type: 'varchar', length: 20 })
  level!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Transcoder, (transcoder) => transcoder.logs)
  @JoinColumn({ name: 'transcoder_id' })
  transcoder!: Transcoder;
}
