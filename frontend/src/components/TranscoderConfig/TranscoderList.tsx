import React, { useState } from 'react';
import { useTranscoders, useDeleteTranscoder } from '../../hooks/useTranscoders';
import { StatusBadge } from '../common/StatusBadge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { TranscoderForm } from './TranscoderForm';
import { Transcoder } from '../../types';

export const TranscoderList: React.FC = () => {
  const { data: transcoders, isLoading } = useTranscoders();
  const deleteMutation = useDeleteTranscoder();
  const [editingTranscoder, setEditingTranscoder] = useState<Transcoder | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Transcoders</h2>
        <button
          onClick={() => {
            setEditingTranscoder(null);
            setShowForm(true);
          }}
          className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          + New Transcoder
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <TranscoderForm
            transcoder={editingTranscoder ?? undefined}
            onClose={() => {
              setShowForm(false);
              setEditingTranscoder(null);
            }}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Format</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {(transcoders ?? []).map((transcoder) => (
              <tr key={transcoder.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{transcoder.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {transcoder.sourceIp}:{transcoder.sourcePort}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{transcoder.outputFormat.toUpperCase()}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={transcoder.status} />
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => {
                      setEditingTranscoder(transcoder);
                      setShowForm(true);
                    }}
                    className="mr-3 text-primary-600 hover:text-primary-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(transcoder.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {(!transcoders || transcoders.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No transcoders configured. Create your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
