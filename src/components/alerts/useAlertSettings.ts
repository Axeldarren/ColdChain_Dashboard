"use client";

import { useState, useEffect } from 'react';
import { AlertSettings, DEFAULT_SETTINGS } from './types';

const STORAGE_KEY = 'coldchain.alertSettings.v1';

export function useAlertSettings() {
  const [settings, setSettingsState] = useState<AlertSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AlertSettings;
        setSettingsState(parsed);
      } else {
        // If no stored settings, write defaults to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch (error) {
      console.error('Failed to load alert settings:', error);
      // Fall back to defaults if localStorage fails
      setSettingsState(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  const setSettings = (next: AlertSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSettingsState(next);
    } catch (error) {
      console.error('Failed to save alert settings:', error);
    }
  };

  const resetToDefaults = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      setSettingsState(DEFAULT_SETTINGS);
    } catch (error) {
      console.error('Failed to reset alert settings:', error);
    }
  };

  return {
    settings,
    setSettings,
    resetToDefaults,
    loading,
  };
}
