// User types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user' | 'technician';
  isActive: boolean;
  createdAt: string;
}

// Zone types
export interface Zone {
  id: number;
  name: string;
  description?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  sensors?: Sensor[];
  // optional property returned by the backend count endpoint
  sensorCount?: number;
}

export interface CreateZoneDto {
  name: string;
  description?: string;
}

export interface UpdateZoneDto {
  name?: string;
  description?: string;
}

// Sensor types - Updated to match backend model
export enum SensorType {
  GAS = 'GAS',
  TEMP = 'TEMP',
  HUMIDITY = 'HUMIDITY',
  FLAME = 'FLAME',
  MOTION = 'MOTION',
}

export enum SensorStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
}

export interface Sensor {
  id: number;
  macAddress: string;
  label: string;
  type: SensorType | string;
  status: SensorStatus | string;
  thresholdValue: number;
  lastValue: number;
  zoneId: number;
  zone?: Zone;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSensorDto {
  macAddress: string;
  label: string;
  type: string;
  thresholdValue: number;
  zoneId: number;
}

export interface UpdateSensorDto {
  label?: string;
  type?: string;
  thresholdValue?: number;
  zoneId?: number;
  status?: string;
}

// Log types
export interface SystemLog {
  id: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'error';
  message: string;
  userId?: string;
}

// Maintenance types
export interface MaintenanceRecord {
  id: string;
  sensorId: string;
  sensorName: string;
  type: 'preventive' | 'corrective';
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  scheduledDate: Date;
  completedDate?: Date;
  technician?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalSensors: number;
  activeSensors: number;
  inactiveSensors: number;
  totalUsers: number;
  activeAlerts: number;
  systemStatus: 'operational' | 'warning' | 'critical';
}

// Auth types
export interface LoginDto {
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuthResponseDto {
  success: boolean;
  message: string;
  token?: string;
  user?: UserDto;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user' | 'technician';
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface UserAdminDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  statut: string;
  isActive: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
  createdAt: string;
}

export interface AdminActionResponseDto {
  success: boolean;
  message: string;
  user?: UserAdminDto;
}

export interface SuspendUserDto {
  reason: string;
}