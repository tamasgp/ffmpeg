import React from 'react';
import { useTranscoderLogs } from '../../hooks/useJobs';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface Props {
  transcoderId: string;
}

const levelColors: Record<string, string> = {
  info: 'text-blue-400',
  warn: 'text-yellow-400',
  error: 'text-red-400',
  debug: 'text-gray-400',
};

export const LogViewer: React.FC<Props> = ({ transcoderId }) => {
  const { data: logs, isLoading } = useTranscoderLogs(transcoderId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-80 overflow-y-auto rounded-lg bg-gray-900 p-4 font-mono text-sm">
      {(logs ?? []).map((log) => (
        <div key={log.id} className="mb-1 flex gap-2">
          <span className="whitespace-nowrap text-xs text-gray-500">
            {new Date(log.createdAt).toLocaleTimeString()}
          </span>
          <span className={`text-xs font-bold uppercase ${levelColors[log.level] ?? 'text-gray-400'}`}>
            [{log.level}]
          </span>
          <span className="text-gray-200">{log.message}</span>
        </div>
      ))}
      {(!logs || logs.length === 0) && <div className="py-4 text-center text-gray-500">No logs available</div>}
    </div>
  );
};
