import { Device, DeviceStats, Alert, TimeSeriesData, DoorEvent } from '@/types';

// Dummy Devices
export const dummyDevices: Device[] = [
  {
    device_id: 'ARD-001',
    device_name: 'Freezer A1',
    location: 'Warehouse North',
    floor: 'Floor 1',
    zone: 'Zone A',
    status: 'online',
    last_seen: new Date(),
  },
  {
    device_id: 'ARD-002',
    device_name: 'Freezer A2',
    location: 'Warehouse North',
    floor: 'Floor 1',
    zone: 'Zone A',
    status: 'online',
    last_seen: new Date(),
  },
  {
    device_id: 'ARD-003',
    device_name: 'Cold Room B1',
    location: 'Warehouse South',
    floor: 'Floor 2',
    zone: 'Zone B',
    status: 'warning',
    last_seen: new Date(Date.now() - 300000),
  },
  {
    device_id: 'ARD-004',
    device_name: 'Refrigerator C1',
    location: 'Storage Area',
    floor: 'Floor 1',
    zone: 'Zone C',
    status: 'online',
    last_seen: new Date(),
  },
];

// Dummy Device Stats
export const dummyDeviceStats: DeviceStats[] = [
  {
    device_id: 'ARD-001',
    device_name: 'Freezer A1',
    location: 'Warehouse North - Zone A',
    current_temp: -18.5,
    current_humidity: 65,
    is_door_open: false,
    power_consumption: 62.23,
    status: 'normal',
    last_updated: new Date(),
  },
  {
    device_id: 'ARD-002',
    device_name: 'Freezer A2',
    location: 'Warehouse North - Zone A',
    current_temp: -19.2,
    current_humidity: 63,
    is_door_open: false,
    power_consumption: 86.04,
    status: 'normal',
    last_updated: new Date(),
  },
  {
    device_id: 'ARD-003',
    device_name: 'Cold Room B1',
    location: 'Warehouse South - Zone B',
    current_temp: 2.8,
    current_humidity: 58,
    is_door_open: true,
    power_consumption: 86.04,
    status: 'warning',
    last_updated: new Date(),
  },
  {
    device_id: 'ARD-004',
    device_name: 'Refrigerator C1',
    location: 'Storage Area - Zone C',
    current_temp: 4.2,
    current_humidity: 55,
    is_door_open: false,
    power_consumption: 45.30,
    status: 'normal',
    last_updated: new Date(),
  },
];

// Generate time series data for charts (last 24 hours)
export const generateTimeSeriesData = (deviceId: string, hours: number = 24): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  const now = new Date();
  
  const baseTemp = deviceId === 'ARD-001' || deviceId === 'ARD-002' ? -18 : 4;
  const tempVariation = 2;
  
  for (let i = hours * 6; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 10 * 60 * 1000); // 10-minute intervals
    const temp = baseTemp + Math.sin(i / 10) * tempVariation + (Math.random() - 0.5);
    const humidity = 60 + Math.sin(i / 15) * 10 + (Math.random() - 0.5) * 5;
    
    data.push({
      timestamp: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temperature: parseFloat(temp.toFixed(1)),
      humidity: parseFloat(humidity.toFixed(0)),
    });
  }
  
  return data;
};

// Dummy Alerts
export const dummyAlerts: Alert[] = [
  {
    id: 1,
    device_id: 'ARD-003',
    device_name: 'Cold Room B1',
    alert_type: 'door',
    severity: 'critical',
    message: 'Door has been open for extended period',
    value: 180,
    threshold: 60,
    timestamp: new Date(Date.now() - 120000),
    acknowledged: false,
  },
  {
    id: 2,
    device_id: 'ARD-001',
    device_name: 'Freezer A1',
    alert_type: 'temperature',
    severity: 'warning',
    message: 'Temperature approaching threshold',
    value: -16.5,
    threshold: -15,
    timestamp: new Date(Date.now() - 300000),
    acknowledged: false,
  },
  {
    id: 3,
    device_id: 'ARD-002',
    device_name: 'Freezer A2',
    alert_type: 'humidity',
    severity: 'info',
    message: 'Humidity level elevated',
    value: 68,
    threshold: 70,
    timestamp: new Date(Date.now() - 600000),
    acknowledged: true,
  },
  {
    id: 4,
    device_id: 'ARD-004',
    device_name: 'Refrigerator C1',
    alert_type: 'temperature',
    severity: 'warning',
    message: 'Temperature fluctuation detected',
    value: 6.2,
    threshold: 6,
    timestamp: new Date(Date.now() - 900000),
    acknowledged: false,
  },
];

// Dummy Door Events
export const dummyDoorEvents: DoorEvent[] = [
  {
    id: 1,
    device_id: 'ARD-001',
    device_name: 'Freezer A1',
    opened_at: new Date(Date.now() - 7200000),
    closed_at: new Date(Date.now() - 7140000),
    duration: 60,
    location: 'Warehouse North - Zone A',
  },
  {
    id: 2,
    device_id: 'ARD-003',
    device_name: 'Cold Room B1',
    opened_at: new Date(Date.now() - 180000),
    closed_at: null,
    duration: null,
    location: 'Warehouse South - Zone B',
  },
  {
    id: 3,
    device_id: 'ARD-002',
    device_name: 'Freezer A2',
    opened_at: new Date(Date.now() - 10800000),
    closed_at: new Date(Date.now() - 10710000),
    duration: 90,
    location: 'Warehouse North - Zone A',
  },
  {
    id: 4,
    device_id: 'ARD-004',
    device_name: 'Refrigerator C1',
    opened_at: new Date(Date.now() - 14400000),
    closed_at: new Date(Date.now() - 14355000),
    duration: 45,
    location: 'Storage Area - Zone C',
  },
  {
    id: 5,
    device_id: 'ARD-001',
    device_name: 'Freezer A1',
    opened_at: new Date(Date.now() - 18000000),
    closed_at: new Date(Date.now() - 17970000),
    duration: 30,
    location: 'Warehouse North - Zone A',
  },
];

// Summary statistics
export const dummySummary = {
  total_devices: 4,
  active_devices: 4,
  critical_alerts: 1,
  warning_alerts: 2,
  average_temperature: -5.7,
  total_door_openings_today: 12,
  avg_door_open_duration: 45,
};
