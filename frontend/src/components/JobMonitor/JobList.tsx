import React from 'react';
import { useJobs } from '../../hooks/useJobs';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { StatusBadge } from '../common/StatusBadge';
import { Job } from '../../types';

interface Props {
  transcoderId?: string;
}

export const JobList: React.FC<Props> = ({ transcoderId }) => {
  const { data: jobs, isLoading } = useJobs(transcoderId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) {
      return '-';
    }
    return new Date(dateStr).toLocaleString();
  };

  const getDuration = (job: Job) => {
    if (!job.startedAt) {
      return '-';
    }
    const end = job.endedAt ? new Date(job.endedAt) : new Date();
    const diff = Math.floor((end.getTime() - new Date(job.startedAt).getTime()) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Job ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Started</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Duration</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Exit Code</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {(jobs ?? []).map((job) => (
            <tr key={job.id}>
              <td className="px-6 py-4 font-mono text-xs text-gray-600">{job.id.slice(0, 8)}...</td>
              <td className="px-6 py-4">
                <StatusBadge status={job.status} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{formatDate(job.startedAt)}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{getDuration(job)}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{job.exitCode ?? '-'}</td>
            </tr>
          ))}
          {(!jobs || jobs.length === 0) && (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                No jobs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
