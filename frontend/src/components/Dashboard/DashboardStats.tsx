import React from 'react';
import { Transcoder, TranscoderStatus } from '../../types';

interface Props {
  transcoders: Transcoder[];
}

export const DashboardStats: React.FC<Props> = ({ transcoders }) => {
  const running = transcoders.filter((transcoder) => transcoder.status === TranscoderStatus.RUNNING).length;
  const stopped = transcoders.filter((transcoder) => transcoder.status === TranscoderStatus.STOPPED).length;
  const idle = transcoders.filter((transcoder) => transcoder.status === TranscoderStatus.IDLE).length;
  const errors = transcoders.filter((transcoder) => transcoder.status === TranscoderStatus.ERROR).length;

  const stats = [
    { label: 'Total Transcoders', value: transcoders.length, color: 'bg-blue-50 text-blue-700' },
    { label: 'Running', value: running, color: 'bg-green-50 text-green-700' },
    { label: 'Idle', value: idle, color: 'bg-gray-50 text-gray-700' },
    { label: 'Stopped', value: stopped, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Errors', value: errors, color: 'bg-red-50 text-red-700' },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.label} className={`rounded-lg p-4 ${stat.color}`}>
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="mt-1 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
