// ──────────────────────────────────────────────
//  Device
// ──────────────────────────────────────────────
export interface Device {
  id: number;
  deviceId: string;       // ex: ESP32-001
  name: string;
  description?: string;
  isOnline: boolean;
  status: string;         // "En ligne" | "Hors ligne"
  zoneId?: number;
  zoneName?: string;
  occupantId?: number;
  occupantName?: string;
  sensorCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeviceDto {
  deviceId: string;
  name: string;
  description?: string;
  occupantUserId: number;  
}

export interface AssignDeviceToZoneDto {
  zoneId: number;
}