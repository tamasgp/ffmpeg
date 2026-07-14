import React from 'react';
import { Transcoder, TranscoderStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { useStartTranscoder, useStopTranscoder } from '../../hooks/useTranscoders';

interface Props {
  transcoder: Transcoder;
}

export const TranscoderStatusCard: React.FC<Props> = ({ transcoder }) => {
  const startMutation = useStartTranscoder();
  const stopMutation = useStopTranscoder();

  const isRunning = transcoder.status === TranscoderStatus.RUNNING;
  const isTransitioning = [TranscoderStatus.STARTING, TranscoderStatus.STOPPING].includes(transcoder.status);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{transcoder.name}</h3>
          <p className="text-sm text-gray-500">
            {transcoder.sourceIp}:{transcoder.sourcePort}
          </p>
        </div>
        <StatusBadge status={transcoder.status} />
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
        <span>
          Format: <strong>{transcoder.outputFormat.toUpperCase()}</strong>
        </span>
        <span>
          HLS Seg: <strong>{transcoder.hlsSegmentDuration}s</strong>
        </span>
      </div>
      <div className="flex gap-2">
        {!isRunning ? (
          <button
            onClick={() => startMutation.mutate(transcoder.id)}
            disabled={isTransitioning || startMutation.isPending}
            className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {startMutation.isPending ? 'Starting...' : 'Start'}
          </button>
        ) : (
          <button
            onClick={() => stopMutation.mutate(transcoder.id)}
            disabled={isTransitioning || stopMutation.isPending}
            className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {stopMutation.isPending ? 'Stopping...' : 'Stop'}
          </button>
        )}
      </div>
    </div>
  );
};
