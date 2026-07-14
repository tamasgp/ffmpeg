import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { StreamType } from '../../types';

@Entity('streams')
export class Stream {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, name: 'transcoder_id' })
  transcoderId!: string;

  @Column({ type: 'int', name: 'stream_index' })
  streamIndex!: number;

  @Column({ type: 'varchar', length: 20, name: 'stream_type' })
  streamType!: StreamType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  codec?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  language?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @Column({ type: 'boolean', default: false, name: 'is_selected' })
  isSelected!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
