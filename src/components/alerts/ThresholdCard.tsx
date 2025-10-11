"use client";

import { MetricThreshold } from './types';

interface ThresholdCardProps {
  title: string;
  kind: 'range' | 'duration';
  value: MetricThreshold;
  onChange: (next: MetricThreshold) => void;
  units?: { minmax?: string; duration?: string };
}

export default function ThresholdCard({ 
  title, 
  kind, 
  value, 
  onChange, 
  units = { minmax: '', duration: 'sec' } 
}: ThresholdCardProps) {
  const handleInputChange = (field: keyof MetricThreshold, val: string) => {
    const numValue = val === '' ? null : parseFloat(val);
    onChange({ ...value, [field]: numValue });
  };

  const handleNumberChange = (field: keyof MetricThreshold, val: string) => {
    const numValue = parseFloat(val) || 0;
    onChange({ ...value, [field]: numValue });
  };

  const handleBooleanChange = (field: keyof MetricThreshold, checked: boolean) => {
    onChange({ ...value, [field]: checked });
  };

  const validateRange = (min: number | null | undefined, max: number | null | undefined) => {
    if (min !== null && min !== undefined && max !== null && max !== undefined) {
      return min <= max;
    }
    return true;
  };

  const validateDuration = (warning: number | null | undefined, critical: number | null | undefined) => {
    if (warning !== null && warning !== undefined && critical !== null && critical !== undefined) {
      return warning <= critical;
    }
    return true;
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-300">{title}</h3>
        <label className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Enabled</span>
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={(e) => handleBooleanChange('enabled', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-800 rounded focus:ring-blue-500 focus:ring-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {kind === 'range' ? (
          <>
            {/* Warning Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Warning Range</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={value.warningMin ?? ''}
                    onChange={(e) => handleInputChange('warningMin', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                  {!validateRange(value.warningMin, value.warningMax) && (
                    <p className="text-xs text-red-400 mt-1">Min must be ≤ Max</p>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Max"
                    value={value.warningMax ?? ''}
                    onChange={(e) => handleInputChange('warningMax', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>
              {units.minmax && (
                <p className="text-xs text-slate-500">{units.minmax}</p>
              )}
            </div>

            {/* Critical Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Critical Range</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={value.criticalMin ?? ''}
                    onChange={(e) => handleInputChange('criticalMin', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                  {!validateRange(value.criticalMin, value.criticalMax) && (
                    <p className="text-xs text-red-400 mt-1">Min must be ≤ Max</p>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Max"
                    value={value.criticalMax ?? ''}
                    onChange={(e) => handleInputChange('criticalMax', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>
              {units.minmax && (
                <p className="text-xs text-slate-500">{units.minmax}</p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Warning Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Warning After</label>
              <input
                type="number"
                min="0"
                placeholder="30"
                value={value.warningDurationSec ?? ''}
                onChange={(e) => handleInputChange('warningDurationSec', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
              {units.duration && (
                <p className="text-xs text-slate-500">{units.duration}</p>
              )}
            </div>

            {/* Critical Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Critical After</label>
              <input
                type="number"
                min="0"
                placeholder="120"
                value={value.criticalDurationSec ?? ''}
                onChange={(e) => handleInputChange('criticalDurationSec', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
              {units.duration && (
                <p className="text-xs text-slate-500">{units.duration}</p>
              )}
              {!validateDuration(value.warningDurationSec, value.criticalDurationSec) && (
                <p className="text-xs text-red-400">Warning must be ≤ Critical</p>
              )}
            </div>
          </>
        )}

        {/* Debounce */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Debounce</label>
          <input
            type="number"
            min="0"
            max="3600"
            value={value.debounceSeconds}
            onChange={(e) => handleNumberChange('debounceSeconds', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-500">sec</p>
        </div>

        {/* Hysteresis */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Hysteresis</label>
          <input
            type="number"
            min="0"
            max="50"
            value={value.hysteresisPercent}
            onChange={(e) => handleNumberChange('hysteresisPercent', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-500">%</p>
        </div>
      </div>
    </div>
  );
}
