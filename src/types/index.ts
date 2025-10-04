// Core data types for Cold Chain Dashboard

export interface Device {
  device_id: string;
  device_name: string;
  location: string;
  floor: string;
  zone: string;
  status: 'online' | 'offline' | 'warning';
  last_seen: Date;
}

export interface SensorReading {
  id: number;
  device_id: string;
  timestamp: Date;
  temperature: number; // in Celsius
  humidity: number; // percentage
  door_open: boolean;
  door_open_duration?: number; // in seconds, only if door_open is true
}

export interface DeviceStats {
  device_id: string;
  device_name: string;
  location: string;
  current_temp: number;
  current_humidity: number;
  is_door_open: boolean;
  power_consumption: number; // in kW
  status: 'critical' | 'warning' | 'normal' | 'low';
  last_updated: Date;
}

export interface Alert {
  id: number;
  device_id: string;
  device_name: string;
  alert_type: 'temperature' | 'humidity' | 'door' | 'offline';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  value: number;
  threshold: number;
  timestamp: Date;
  acknowledged: boolean;
}

export interface TimeSeriesData {
  timestamp: string;
  temperature: number;
  humidity: number;
}

export interface DoorEvent {
  id: number;
  device_id: string;
  device_name: string;
  opened_at: Date;
  closed_at: Date | null;
  duration: number | null; // in seconds
  location: string;
}
