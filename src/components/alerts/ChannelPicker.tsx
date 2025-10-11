"use client";

import { Channel } from './types';

interface ChannelPickerProps {
  value: Channel[];
  onChange: (next: Channel[]) => void;
}

const CHANNEL_LABELS: Record<Channel, string> = {
  inapp: 'In-App Notifications',
  email: 'Email',
  sms: 'SMS',
  webhook: 'Webhook',
};

export default function ChannelPicker({ value, onChange }: ChannelPickerProps) {
  const toggleChannel = (channel: Channel) => {
    if (value.includes(channel)) {
      // Don't allow removing the last channel
      if (value.length > 1) {
        onChange(value.filter(c => c !== channel));
      }
    } else {
      onChange([...value, channel]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Delivery Channels</h3>
      
      {/* Current channels badges */}
      {value.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Active channels:</p>
          <div className="flex flex-wrap gap-2">
            {value.map(channel => (
              <span
                key={channel}
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium"
              >
                {CHANNEL_LABELS[channel]}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Channel toggles */}
      <div className="space-y-3">
        {(Object.keys(CHANNEL_LABELS) as Channel[]).map(channel => {
          const isEnabled = value.includes(channel);
          const isDisabled = isEnabled && value.length === 1;
          
          return (
            <div key={channel} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-200">{CHANNEL_LABELS[channel]}</span>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  disabled={isDisabled}
                  onChange={() => toggleChannel(channel)}
                  className={`w-4 h-4 text-blue-600 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500 focus:ring-2 ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                {isDisabled && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">(Required)</span>
                )}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
