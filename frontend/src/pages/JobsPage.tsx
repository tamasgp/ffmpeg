import React, { useState } from 'react';
import { JobList } from '../components/JobMonitor/JobList';
import { LogViewer } from '../components/JobMonitor/LogViewer';
import { useTranscoders } from '../hooks/useTranscoders';

export const JobsPage: React.FC = () => {
  const { data: transcoders } = useTranscoders();
  const [selectedTranscoderId, setSelectedTranscoderId] = useState<string>('');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Monitor</h1>
        <p className="mt-1 text-gray-500">Monitor transcoder jobs and view logs</p>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Filter by Transcoder</label>
        <select
          className="rounded-md border border-gray-300 p-2 text-sm"
          value={selectedTranscoderId}
          onChange={(event) => setSelectedTranscoderId(event.target.value)}
        >
          <option value="">All Transcoders</option>
          {(transcoders ?? []).map((transcoder) => (
            <option key={transcoder.id} value={transcoder.id}>
              {transcoder.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Jobs</h2>
        <JobList transcoderId={selectedTranscoderId || undefined} />
      </div>

      {selectedTranscoderId && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Logs</h2>
          <LogViewer transcoderId={selectedTranscoderId} />
        </div>
      )}
    </div>
  );
};
