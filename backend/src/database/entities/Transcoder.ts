import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TranscoderStatus, OutputFormat } from '../../types';
import { Job } from './Job';
import { TranscoderLog } from './TranscoderLog';

@Entity('transcoders')
export class Transcoder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 45, name: 'source_ip' })
  sourceIp!: string;

  @Column({ type: 'int', name: 'source_port' })
  sourcePort!: number;

  @Column({ type: 'varchar', length: 50, name: 'output_format', default: OutputFormat.HLS })
  outputFormat!: OutputFormat;

  @Column({ type: 'varchar', length: 500, name: 'output_path' })
  outputPath!: string;

  @Column({ type: 'int', name: 'hls_segment_duration', default: 4 })
  hlsSegmentDuration!: number;

  @Column({ type: 'int', name: 'hls_playlist_size', default: 5 })
  hlsPlaylistSize!: number;

  @Column({ type: 'jsonb', name: 'selected_streams', nullable: true })
  selectedStreams?: Record<string, unknown>;

  @Column({ type: 'varchar', length: 50, default: TranscoderStatus.IDLE })
  status!: TranscoderStatus;

  @Column({ type: 'varchar', length: 255, name: 'service_name', nullable: true })
  serviceName?: string;

  @Column({ type: 'varchar', length: 36, name: 'abr_template_id', nullable: true })
  abrTemplateId?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Job, (job) => job.transcoder)
  jobs!: Job[];

  @OneToMany(() => TranscoderLog, (log) => log.transcoder)
  logs!: TranscoderLog[];
}
