import React, { useState } from 'react';
import { useCreateTranscoder, useUpdateTranscoder } from '../../hooks/useTranscoders';
import { useAbrTemplates } from '../../hooks/useAbrTemplates';
import { Transcoder, OutputFormat } from '../../types';

interface Props {
  transcoder?: Transcoder;
  onClose: () => void;
}

export const TranscoderForm: React.FC<Props> = ({ transcoder, onClose }) => {
  const createMutation = useCreateTranscoder();
  const updateMutation = useUpdateTranscoder();
  const { data: templates } = useAbrTemplates();

  const [form, setForm] = useState({
    name: transcoder?.name ?? '',
    sourceIp: transcoder?.sourceIp ?? '',
    sourcePort: transcoder?.sourcePort ?? 5000,
    outputFormat: transcoder?.outputFormat ?? OutputFormat.HLS,
    outputPath: transcoder?.outputPath ?? '/var/media/hls/output.m3u8',
    hlsSegmentDuration: transcoder?.hlsSegmentDuration ?? 4,
    hlsPlaylistSize: transcoder?.hlsPlaylistSize ?? 5,
    abrTemplateId: transcoder?.abrTemplateId ?? '',
    description: transcoder?.description ?? '',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      abrTemplateId: form.abrTemplateId || undefined,
    };

    if (transcoder) {
      await updateMutation.mutateAsync({ id: transcoder.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    onClose();
  };

  const inputClass =
    'mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500';

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-medium">{transcoder ? 'Edit Transcoder' : 'New Transcoder'}</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Source IP</label>
          <input
            className={inputClass}
            value={form.sourceIp}
            onChange={(event) => setForm((current) => ({ ...current, sourceIp: event.target.value }))}
            required
            placeholder="239.0.0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">UDP Port</label>
          <input
            type="number"
            className={inputClass}
            value={form.sourcePort}
            onChange={(event) => setForm((current) => ({ ...current, sourcePort: Number(event.target.value) }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Output Format</label>
          <select
            className={inputClass}
            value={form.outputFormat}
            onChange={(event) =>
              setForm((current) => ({ ...current, outputFormat: event.target.value as OutputFormat }))
            }
          >
            <option value="hls">HLS</option>
            <option value="dash">DASH</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Output Path</label>
          <input
            className={inputClass}
            value={form.outputPath}
            onChange={(event) => setForm((current) => ({ ...current, outputPath: event.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">HLS Segment Duration (s)</label>
          <input
            type="number"
            className={inputClass}
            value={form.hlsSegmentDuration}
            onChange={(event) =>
              setForm((current) => ({ ...current, hlsSegmentDuration: Number(event.target.value) }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">HLS Playlist Size</label>
          <input
            type="number"
            className={inputClass}
            value={form.hlsPlaylistSize}
            onChange={(event) =>
              setForm((current) => ({ ...current, hlsPlaylistSize: Number(event.target.value) }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ABR Template</label>
          <select
            className={inputClass}
            value={form.abrTemplateId}
            onChange={(event) => setForm((current) => ({ ...current, abrTemplateId: event.target.value }))}
          >
            <option value="">-- No Template (Copy) --</option>
            {(templates ?? []).map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            className={inputClass}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          />
        </div>
        <div className="col-span-2 flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700"
          >
            {transcoder ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};
