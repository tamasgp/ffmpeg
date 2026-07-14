export enum TranscoderStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  STOPPED = 'stopped',
  ERROR = 'error',
  STARTING = 'starting',
  STOPPING = 'stopping',
}

export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum OutputFormat {
  HLS = 'hls',
  DASH = 'dash',
}

export interface VideoProfile {
  name: string;
  width: number;
  height: number;
  bitrate: string;
  framerate: number;
  codec: string;
}

export interface AudioProfile {
  name: string;
  bitrate: string;
  sampleRate: number;
  channels: number;
  codec: string;
}

export interface AbrLadder {
  videoProfiles: VideoProfile[];
  audioProfiles: AudioProfile[];
}

export interface Transcoder {
  id: string;
  name: string;
  sourceIp: string;
  sourcePort: number;
  outputFormat: OutputFormat;
  outputPath: string;
  hlsSegmentDuration: number;
  hlsPlaylistSize: number;
  selectedStreams?: Record<string, unknown>;
  status: TranscoderStatus;
  abrTemplateId?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AbrTemplate {
  id: string;
  name: string;
  description?: string;
  abrLadder: AbrLadder;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  transcoderId: string;
  status: JobStatus;
  ffmpegCommand?: string;
  pid?: number;
  startedAt?: string;
  endedAt?: string;
  exitCode?: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TranscoderLog {
  id: string;
  transcoderId: string;
  jobId?: string;
  level: string;
  message: string;
  createdAt: string;
}

export interface WebSocketMessage {
  type: 'status_update' | 'metrics' | 'log' | 'error';
  transcoderId?: string;
  payload: unknown;
  timestamp: string;
}
