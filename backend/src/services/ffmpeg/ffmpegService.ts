import { AppDataSource } from '../../database/dataSource';
import { Transcoder } from '../../database/entities/Transcoder';
import { Job } from '../../database/entities/Job';
import { TranscoderLog } from '../../database/entities/TranscoderLog';
import { AbrTemplate } from '../../database/entities/AbrTemplate';
import { JobStatus, TranscoderStatus, OutputFormat } from '../../types';
import { logger } from '../../utils/logger';
import { WebSocketService } from '../websocket/websocketService';

export class FfmpegService {
  private wsService: WebSocketService;

  constructor(wsService: WebSocketService) {
    this.wsService = wsService;
  }

  buildFfmpegCommand(transcoder: Transcoder, abrTemplate?: AbrTemplate): string {
    const parts: string[] = ['ffmpeg', '-re'];

    parts.push(`-i udp://${transcoder.sourceIp}:${transcoder.sourcePort}`);

    if (abrTemplate) {
      const { videoProfiles, audioProfiles } = abrTemplate.abrLadder;

      videoProfiles.forEach(() => {
        parts.push('-map 0:v:0');
      });

      audioProfiles.forEach(() => {
        parts.push('-map 0:a:0');
      });

      videoProfiles.forEach((vp, index) => {
        parts.push(
          `-c:v:${index} ${vp.codec}`,
          `-b:v:${index} ${vp.bitrate}`,
          `-s:v:${index} ${vp.width}x${vp.height}`,
          `-r:v:${index} ${vp.framerate}`,
        );
      });

      audioProfiles.forEach((ap, index) => {
        parts.push(
          `-c:a:${index} ${ap.codec}`,
          `-b:a:${index} ${ap.bitrate}`,
          `-ar:a:${index} ${ap.sampleRate}`,
          `-ac:a:${index} ${ap.channels}`,
        );
      });
    } else {
      parts.push('-c copy');
    }

    if (transcoder.outputFormat === OutputFormat.HLS) {
      parts.push(
        '-f hls',
        `-hls_time ${transcoder.hlsSegmentDuration}`,
        `-hls_list_size ${transcoder.hlsPlaylistSize}`,
        '-hls_flags delete_segments',
        transcoder.outputPath,
      );
    } else {
      parts.push(
        '-f dash',
        `-seg_duration ${transcoder.hlsSegmentDuration}`,
        transcoder.outputPath,
      );
    }

    return parts.join(' ');
  }

  async startTranscoder(transcoderId: string): Promise<Job> {
    const transcoderRepo = AppDataSource.getRepository(Transcoder);
    const jobRepo = AppDataSource.getRepository(Job);
    const logRepo = AppDataSource.getRepository(TranscoderLog);
    const abrRepo = AppDataSource.getRepository(AbrTemplate);

    const transcoder = await transcoderRepo.findOne({ where: { id: transcoderId } });
    if (!transcoder) {
      throw new Error(`Transcoder ${transcoderId} not found`);
    }

    if (transcoder.status === TranscoderStatus.RUNNING) {
      throw new Error('Transcoder is already running');
    }

    const abrTemplate = transcoder.abrTemplateId
      ? (await abrRepo.findOne({ where: { id: transcoder.abrTemplateId } })) ?? undefined
      : undefined;

    const command = this.buildFfmpegCommand(transcoder, abrTemplate);

    const job = jobRepo.create({
      transcoderId,
      status: JobStatus.PENDING,
      ffmpegCommand: command,
      startedAt: new Date(),
    });
    await jobRepo.save(job);

    transcoder.status = TranscoderStatus.STARTING;
    await transcoderRepo.save(transcoder);

    const startLog = logRepo.create({
      transcoderId,
      jobId: job.id,
      level: 'info',
      message: `Starting transcoder with command: ${command}`,
    });
    await logRepo.save(startLog);

    this.wsService.broadcast({
      type: 'status_update',
      transcoderId,
      payload: { status: TranscoderStatus.STARTING, jobId: job.id },
      timestamp: new Date().toISOString(),
    });

    job.status = JobStatus.RUNNING;
    transcoder.status = TranscoderStatus.RUNNING;
    await jobRepo.save(job);
    await transcoderRepo.save(transcoder);

    this.wsService.broadcast({
      type: 'status_update',
      transcoderId,
      payload: { status: TranscoderStatus.RUNNING, jobId: job.id },
      timestamp: new Date().toISOString(),
    });

    logger.info(`Transcoder ${transcoderId} started, job ${job.id}`);
    return job;
  }

  async stopTranscoder(transcoderId: string): Promise<void> {
    const transcoderRepo = AppDataSource.getRepository(Transcoder);
    const jobRepo = AppDataSource.getRepository(Job);
    const logRepo = AppDataSource.getRepository(TranscoderLog);

    const transcoder = await transcoderRepo.findOne({ where: { id: transcoderId } });
    if (!transcoder) {
      throw new Error(`Transcoder ${transcoderId} not found`);
    }

    if (transcoder.status !== TranscoderStatus.RUNNING) {
      throw new Error('Transcoder is not running');
    }

    transcoder.status = TranscoderStatus.STOPPING;
    await transcoderRepo.save(transcoder);

    const activeJob = await jobRepo.findOne({
      where: { transcoderId, status: JobStatus.RUNNING },
    });

    if (activeJob) {
      activeJob.status = JobStatus.COMPLETED;
      activeJob.endedAt = new Date();
      activeJob.exitCode = 0;
      await jobRepo.save(activeJob);
    }

    transcoder.status = TranscoderStatus.STOPPED;
    await transcoderRepo.save(transcoder);

    const stopLog = logRepo.create({
      transcoderId,
      jobId: activeJob?.id,
      level: 'info',
      message: 'Transcoder stopped',
    });
    await logRepo.save(stopLog);

    this.wsService.broadcast({
      type: 'status_update',
      transcoderId,
      payload: { status: TranscoderStatus.STOPPED },
      timestamp: new Date().toISOString(),
    });

    logger.info(`Transcoder ${transcoderId} stopped`);
  }
}
