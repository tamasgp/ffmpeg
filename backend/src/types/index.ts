export enum TranscoderStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  STOPPED = 'stopped',
  ERROR = 'error',
  STARTING = 'starting',
  STOPPING = 'stopping',
}

export enum StreamType {
  VIDEO = 'video',
  AUDIO = 'audio',
  SUBTITLE = 'subtitle',
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

export interface WebSocketMessage {
  type: 'status_update' | 'metrics' | 'log' | 'error';
  transcoderId?: string;
  payload: unknown;
  timestamp: string;
}
