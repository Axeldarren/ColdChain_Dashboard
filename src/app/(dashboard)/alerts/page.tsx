"use client";

import { useState, useEffect } from 'react';
import { AlertSettings, MetricThreshold, Channel } from '@/components/alerts/types';
import { useAlertSettings } from '@/components/alerts/useAlertSettings';
import ThresholdCard from '@/components/alerts/ThresholdCard';
import ChannelPicker from '@/components/alerts/ChannelPicker';

export default function AlertsPage() {
  const { settings, setSettings, resetToDefaults, loading } = useAlertSettings();
  const [localSettings, setLocalSettings] = useState<AlertSettings>(settings);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Update local state when settings change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleThresholdChange = (metric: keyof AlertSettings['defaults'], value: MetricThreshold) => {
    setLocalSettings(prev => ({
      ...prev,
      defaults: {
        ...prev.defaults,
        [metric]: value,
      },
    }));
  };

  const handleChannelsChange = (channels: string[]) => {
    setLocalSettings(prev => ({
      ...prev,
      channels: channels as Channel[],
    }));
  };

  const handleQuietHoursChange = (field: 'start' | 'end', value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      quietHours: {
        start: field === 'start' ? value : (prev.quietHours?.start || ''),
        end: field === 'end' ? value : (prev.quietHours?.end || ''),
      },
    }));
  };

  const validateSettings = (): string[] => {
    const errors: string[] = [];
    const { defaults } = localSettings;

    // Validate temperature ranges
    if (defaults.temperature.warningMin !== null && defaults.temperature.warningMin !== undefined && 
        defaults.temperature.warningMax !== null && defaults.temperature.warningMax !== undefined) {
      if (defaults.temperature.warningMin > defaults.temperature.warningMax) {
        errors.push('Temperature warning min must be ≤ max');
      }
    }
    if (defaults.temperature.criticalMin !== null && defaults.temperature.criticalMin !== undefined && 
        defaults.temperature.criticalMax !== null && defaults.temperature.criticalMax !== undefined) {
      if (defaults.temperature.criticalMin > defaults.temperature.criticalMax) {
        errors.push('Temperature critical min must be ≤ max');
      }
    }

    // Validate humidity ranges
    if (defaults.humidity.warningMin !== null && defaults.humidity.warningMin !== undefined && 
        defaults.humidity.warningMax !== null && defaults.humidity.warningMax !== undefined) {
      if (defaults.humidity.warningMin > defaults.humidity.warningMax) {
        errors.push('Humidity warning min must be ≤ max');
      }
    }
    if (defaults.humidity.criticalMin !== null && defaults.humidity.criticalMin !== undefined && 
        defaults.humidity.criticalMax !== null && defaults.humidity.criticalMax !== undefined) {
      if (defaults.humidity.criticalMin > defaults.humidity.criticalMax) {
        errors.push('Humidity critical min must be ≤ max');
      }
    }

    // Validate door durations
    if (defaults.doorOpen.warningDurationSec !== null && defaults.doorOpen.warningDurationSec !== undefined && 
        defaults.doorOpen.criticalDurationSec !== null && defaults.doorOpen.criticalDurationSec !== undefined) {
      if (defaults.doorOpen.warningDurationSec > defaults.doorOpen.criticalDurationSec) {
        errors.push('Door warning duration must be ≤ critical duration');
      }
    }

    // Validate debounce and hysteresis ranges
    Object.entries(defaults).forEach(([metric, config]) => {
      if (config.debounceSeconds < 0 || config.debounceSeconds > 3600) {
        errors.push(`${metric} debounce must be between 0-3600 seconds`);
      }
      if (config.hysteresisPercent < 0 || config.hysteresisPercent > 50) {
        errors.push(`${metric} hysteresis must be between 0-50%`);
      }
    });

    return errors;
  };

  const handleSave = () => {
    const errors = validateSettings();
    if (errors.length > 0) {
      alert(`Validation errors:\n${errors.join('\n')}`);
      return;
    }

    setSettings(localSettings);
    
    // Show success message
    if (typeof window !== 'undefined') {
      // Simple alert fallback since no toast library is specified
      alert('Alert settings saved successfully!');
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setLocalSettings(settings);
    setShowResetDialog(false);
    alert('Settings reset to defaults');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Loading alert settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-300">Alerts & Thresholds</h1>
      </div>

      {/* Threshold Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <ThresholdCard
          title="Temperature"
          kind="range"
          value={localSettings.defaults.temperature}
          onChange={(value) => handleThresholdChange('temperature', value)}
          units={{ minmax: '°C' }}
        />
        
        <ThresholdCard
          title="Humidity"
          kind="range"
          value={localSettings.defaults.humidity}
          onChange={(value) => handleThresholdChange('humidity', value)}
          units={{ minmax: '%' }}
        />
        
        <ThresholdCard
          title="Door Open"
          kind="duration"
          value={localSettings.defaults.doorOpen}
          onChange={(value) => handleThresholdChange('doorOpen', value)}
          units={{ duration: 'sec' }}
        />
      </div>

      {/* Delivery Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChannelPicker
          value={localSettings.channels}
          onChange={handleChannelsChange}
        />

        {/* Quiet Hours */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-300 mb-4">Quiet Hours</h3>
          <p className="text-sm text-slate-400 mb-4">
            Non in-app alerts are suppressed during quiet hours.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={localSettings.quietHours?.start || ''}
                onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={localSettings.quietHours?.end || ''}
                onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={() => setShowResetDialog(true)}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
        >
          Reset to Defaults
        </button>
        
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Save Settings
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-300 mb-4">
              Reset to Defaults
            </h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to reset all alert settings to their default values? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetDialog(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
