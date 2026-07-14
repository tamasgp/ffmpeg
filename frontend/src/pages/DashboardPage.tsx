import React from 'react';
import { Link } from 'react-router-dom';
import { useTranscoders } from '../hooks/useTranscoders';
import { DashboardStats } from '../components/Dashboard/DashboardStats';
import { TranscoderStatusCard } from '../components/Dashboard/TranscoderStatusCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const { data: transcoders, isLoading } = useTranscoders();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">Real-time FFmpeg transcoder status overview</p>
      </div>

      <DashboardStats transcoders={transcoders ?? []} />

      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Active Transcoders</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(transcoders ?? []).map((transcoder) => (
            <TranscoderStatusCard key={transcoder.id} transcoder={transcoder} />
          ))}
          {(!transcoders || transcoders.length === 0) && (
            <div className="col-span-3 py-12 text-center text-gray-500">
              No transcoders configured yet.
              <Link to="/transcoders" className="ml-1 text-primary-600 hover:underline">
                Create one
              </Link>
              .
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
