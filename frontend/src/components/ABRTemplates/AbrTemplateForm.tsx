import React, { useState } from 'react';
import { useCreateAbrTemplate, useUpdateAbrTemplate } from '../../hooks/useAbrTemplates';
import { AbrTemplate, VideoProfile, AudioProfile } from '../../types';

interface Props {
  template?: AbrTemplate;
  onClose: () => void;
}

const defaultVideoProfile = (): VideoProfile => ({
  name: '1080p',
  width: 1920,
  height: 1080,
  bitrate: '5000k',
  framerate: 30,
  codec: 'libx264',
});

const defaultAudioProfile = (): AudioProfile => ({
  name: 'stereo',
  bitrate: '128k',
  sampleRate: 48000,
  channels: 2,
  codec: 'aac',
});

export const AbrTemplateForm: React.FC<Props> = ({ template, onClose }) => {
  const createMutation = useCreateAbrTemplate();
  const updateMutation = useUpdateAbrTemplate();

  const [name, setName] = useState(template?.name ?? '');
  const [description, setDescription] = useState(template?.description ?? '');
  const [isDefault, setIsDefault] = useState(template?.isDefault ?? false);
  const [videoProfiles, setVideoProfiles] = useState<VideoProfile[]>(
    template?.abrLadder.videoProfiles ?? [defaultVideoProfile()],
  );
  const [audioProfiles, setAudioProfiles] = useState<AudioProfile[]>(
    template?.abrLadder.audioProfiles ?? [defaultAudioProfile()],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = {
      name,
      description,
      isDefault,
      abrLadder: { videoProfiles, audioProfiles },
    };

    if (template) {
      await updateMutation.mutateAsync({ id: template.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }

    onClose();
  };

  const inputClass = 'w-full rounded border border-gray-300 p-1.5 text-sm';

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-medium">{template ? 'Edit Template' : 'New ABR Template'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
            <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <input className={inputClass} value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(event) => setIsDefault(event.target.checked)}
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700">
              Set as default template
            </label>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-800">Video Profiles</h4>
            <button
              type="button"
              onClick={() => setVideoProfiles((current) => [...current, defaultVideoProfile()])}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              + Add Profile
            </button>
          </div>
          <div className="space-y-2">
            {videoProfiles.map((profile, index) => (
              <div key={`video-${index}`} className="grid grid-cols-6 gap-2 rounded bg-gray-50 p-2">
                <input
                  className={inputClass}
                  placeholder="Name"
                  value={profile.name}
                  onChange={(event) =>
                    setVideoProfiles((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, name: event.target.value } : item,
                      ),
                    )
                  }
                />
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Width"
                  value={profile.width}
                  onChange={(event) =>
                    setVideoProfiles((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, width: Number(event.target.value) } : item,
                      ),
                    )
                  }
                />
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Height"
                  value={profile.height}
                  onChange={(event) =>
                    setVideoProfiles((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, height: Number(event.target.value) } : item,
                      ),
                    )
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Bitrate"
                  value={profile.bitrate}
                  onChange={(event) =>
                    setVideoProfiles((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, bitrate: event.target.value } : item,
                      ),
                    )
                  }
                />
                <input
                  type="number"
                  className={inputClass}
                  placeholder="FPS"
                  value={profile.framerate}
                  onChange={(event) =>
                    setVideoProfiles((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, framerate: Number(event.target.value) } : item,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() => setVideoProfiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-800">Audio Profiles</h4>
            <button
              type="button"
              onClick={() => setAudioProfiles((current) => [...current, defaultAudioProfile()])}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              + Add Profile
            </button>
          </div>
          <div className="space-y-2">
            {audioProfiles.map((profile, index) => (
              <div key={`audio-${index}`} className="grid grid-cols-5 gap-2 rounded bg-gray-50 p-2">
                <input
                  className={inputClass}
                  placeholder="Name"
                  value={profile.name}
                  onChange={(event) =>
                    setAudioProfiles((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, name: event.target.value } : item,
                      ),
                    )
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Bitrate"
                  value={profile.bitrate}
                  onChange={(event) =>
                    setAudioProfiles((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, bitrate: event.target.value } : item,
                      ),
                    )
                  }
                />
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Sample Rate"
                  value={profile.sampleRate}
                  onChange={(event) =>
                    setAudioProfiles((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, sampleRate: Number(event.target.value) } : item,
                      ),
                    )
                  }
                />
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Channels"
                  value={profile.channels}
                  onChange={(event) =>
                    setAudioProfiles((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, channels: Number(event.target.value) } : item,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() => setAudioProfiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700"
          >
            {template ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};
