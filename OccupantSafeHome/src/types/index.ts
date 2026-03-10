// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  user: User
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  role: 'owner' | 'member' | 'observer'
  createdAt: string
  lastLogin?: string
}

export interface RegisterRequest {
  name: string
  prenom: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface RegisterResponse {
  user: User
  accessToken: string
}

// Sensor & Device Types
export interface Zone {
  id: number
  name: string
  sensors: number
  emoji?: string
  status: 'active' | 'inactive' | 'alert'
}

export interface Sensor {
  id: number
  name: string
  type: 'smoke' | 'gas' | 'temperature' | 'motion'
  status: 'online' | 'offline'
  battery: number
  value: number
  unit: string
  zoneId: number
  lastUpdate: string
}

export interface Device {
  id: number
  name: string
  type: string
  status: 'online' | 'offline'
  battery: number
  connection: string
  lastSeen: string
}

// Alert Types
export interface Alert {
  id: number
  type: string
  severity: 'critique' | 'attention' | 'normale'
  zone: string
  message: string
  timestamp: string
  sensor: string
  value: number | string
  resolved: boolean
}

export interface ResolveAlertRequest {
  alertId: number
  reason?: string
}

// Control Types
export interface SystemState {
  globalSwitch: boolean
  zones: Record<number, boolean>
  alarmActive: boolean
}

export interface ControlRequest {
  globalSwitch?: boolean
  zoneId?: number
  status?: boolean
  tempDisable?: {
    duration: number // seconds
    reason: string
  }
}

// Contact Types
export interface Contact {
  id: number
  name: string
  relation: string
  phone: string
  emoji: string
  isEmergency: boolean
}

export interface AddContactRequest {
  name: string
  relation: string
  phone: string
  emoji: string
}

// Family Types
export interface FamilyMember {
  id: number
  name: string
  email: string
  status: 'active' | 'pending'
  role: string
  accessLevel: string
  joinedDate: string
}

export interface InviteMemberRequest {
  email: string
  accessLevel: 'owner' | 'member' | 'observer'
  relation: string
}

// Dashboard Types
export interface DashboardStats {
  zonesOk: number
  activeAlerts: number
  activeSensors: number
  avgResponseTime: number
}

export interface RecentAlert {
  id: number
  type: string
  severity: string
  zone: string
  time: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// Error Types
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}
