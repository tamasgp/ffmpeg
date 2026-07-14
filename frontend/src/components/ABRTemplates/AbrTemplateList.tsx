import React, { useState } from 'react';
import { useAbrTemplates, useDeleteAbrTemplate } from '../../hooks/useAbrTemplates';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { AbrTemplateForm } from './AbrTemplateForm';
import { AbrTemplate } from '../../types';

export const AbrTemplateList: React.FC = () => {
  const { data: templates, isLoading } = useAbrTemplates();
  const deleteMutation = useDeleteAbrTemplate();
  const [editingTemplate, setEditingTemplate] = useState<AbrTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">ABR Templates</h2>
        <button
          onClick={() => {
            setEditingTemplate(null);
            setShowForm(true);
          }}
          className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          + New Template
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <AbrTemplateForm
            template={editingTemplate ?? undefined}
            onClose={() => {
              setShowForm(false);
              setEditingTemplate(null);
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(templates ?? []).map((template) => (
          <div key={template.id} className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{template.name}</h3>
                {template.description && <p className="text-sm text-gray-500">{template.description}</p>}
              </div>
              {template.isDefault && (
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">Default</span>
              )}
            </div>

            <div className="mb-3">
              <h4 className="mb-2 text-xs font-medium uppercase text-gray-500">Video Profiles</h4>
              <div className="space-y-1">
                {template.abrLadder.videoProfiles.map((profile, index) => (
                  <div key={`${profile.name}-${index}`} className="flex justify-between text-sm text-gray-700">
                    <span>{profile.name}</span>
                    <span className="text-gray-500">
                      {profile.width}x{profile.height} @ {profile.bitrate} {profile.framerate}fps
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="mb-2 text-xs font-medium uppercase text-gray-500">Audio Profiles</h4>
              <div className="space-y-1">
                {template.abrLadder.audioProfiles.map((profile, index) => (
                  <div key={`${profile.name}-${index}`} className="flex justify-between text-sm text-gray-700">
                    <span>{profile.name}</span>
                    <span className="text-gray-500">
                      {profile.bitrate} {profile.sampleRate}Hz
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingTemplate(template);
                  setShowForm(true);
                }}
                className="flex-1 rounded border border-primary-600 py-1 text-sm text-primary-600 hover:bg-primary-50"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(template.id)}
                className="flex-1 rounded border border-red-300 py-1 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {(!templates || templates.length === 0) && (
          <div className="col-span-2 py-8 text-center text-gray-500">
            No ABR templates. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
};
