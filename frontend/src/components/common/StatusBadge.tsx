import React from 'react';
import { TranscoderStatus, JobStatus } from '../../types';

interface StatusBadgeProps {
  status: TranscoderStatus | JobStatus | string;
}

const statusColors: Record<string, string> = {
  idle: 'bg-gray-100 text-gray-800',
  running: 'bg-green-100 text-green-800',
  stopped: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  starting: 'bg-blue-100 text-blue-800',
  stopping: 'bg-orange-100 text-orange-800',
  pending: 'bg-gray-100 text-gray-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-yellow-100 text-yellow-800',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {status}
    </span>
  );
};
