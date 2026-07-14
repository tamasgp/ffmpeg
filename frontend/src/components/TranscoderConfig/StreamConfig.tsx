import React from 'react';

interface StreamInfo {
  index: number;
  type: string;
  codec: string;
  language?: string;
}

interface Props {
  streams: StreamInfo[];
  selectedStreams: number[];
  onToggle: (index: number) => void;
}

export const StreamConfig: React.FC<Props> = ({ streams, selectedStreams, onToggle }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Stream Selection</h4>
      {streams.map((stream) => (
        <label
          key={stream.index}
          className="flex cursor-pointer items-center gap-3 rounded border p-2 hover:bg-gray-50"
        >
          <input
            type="checkbox"
            checked={selectedStreams.includes(stream.index)}
            onChange={() => onToggle(stream.index)}
            className="rounded"
          />
          <span className="text-sm">
            [{stream.index}] {stream.type.toUpperCase()} - {stream.codec}
            {stream.language ? ` (${stream.language})` : ''}
          </span>
        </label>
      ))}
      {streams.length === 0 && <p className="text-sm text-gray-500">No streams detected</p>}
    </div>
  );
};
