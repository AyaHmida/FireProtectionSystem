import apiClient from './apiClient'
import { 
  Zone, 
  Sensor, 
  Device, 
  Alert, 
  DashboardStats, 
  RecentAlert,
  SystemState,
  ControlRequest
} from '../types'

class SystemService {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/dashboard/stats')
  }

  async getRecentAlerts(): Promise<RecentAlert[]> {
    return apiClient.get<RecentAlert[]>('/dashboard/recent-alerts')
  }

  // Zones
  async getZones(): Promise<Zone[]> {
    return apiClient.get<Zone[]>('/zones')
  }

  async getZone(id: number): Promise<Zone> {
    return apiClient.get<Zone>(`/zones/${id}`)
  }

  async updateZone(id: number, data: Partial<Zone>): Promise<Zone> {
    return apiClient.put<Zone>(`/zones/${id}`, data)
  }

  // Sensors
  async getSensors(): Promise<Sensor[]> {
    return apiClient.get<Sensor[]>('/sensors')
  }

  async getSensorsByZone(zoneId: number): Promise<Sensor[]> {
    return apiClient.get<Sensor[]>(`/zones/${zoneId}/sensors`)
  }

  async getSensor(id: number): Promise<Sensor> {
    return apiClient.get<Sensor>(`/sensors/${id}`)
  }

  // Devices
  async getDevices(): Promise<Device[]> {
    return apiClient.get<Device[]>('/devices')
  }

  async getDevice(id: number): Promise<Device> {
    return apiClient.get<Device>(`/devices/${id}`)
  }

  async toggleDevice(id: number, status: boolean): Promise<Device> {
    return apiClient.put<Device>(`/devices/${id}`, { status })
  }

  // Alerts
  async getAlerts(filter?: 'all' | 'active' | 'resolved'): Promise<Alert[]> {
    const endpoint = filter ? `/alerts?filter=${filter}` : '/alerts'
    return apiClient.get<Alert[]>(endpoint)
  }

  async getAlert(id: number): Promise<Alert> {
    return apiClient.get<Alert>(`/alerts/${id}`)
  }

  async resolveAlert(id: number, reason?: string): Promise<Alert> {
    return apiClient.put<Alert>(`/alerts/${id}/resolve`, { reason })
  }

  // System Control
  async getSystemState(): Promise<SystemState> {
    return apiClient.get<SystemState>('/system/state')
  }

  async updateSystemControl(data: ControlRequest): Promise<SystemState> {
    return apiClient.put<SystemState>('/system/control', data as unknown as Record<string, unknown>)
  }

  async toggleSystemSwitch(status: boolean): Promise<SystemState> {
    return apiClient.put<SystemState>('/system/toggle', { status })
  }

  async toggleZone(zoneId: number, status: boolean): Promise<SystemState> {
    return apiClient.put<SystemState>(`/system/zones/${zoneId}`, { status })
  }

  async stopAlarm(): Promise<{ message: string }> {
    return apiClient.post('/system/alarm/stop', {})
  }

  async setTemporaryDisable(duration: number, reason: string): Promise<{ message: string; resumeAt: string }> {
    return apiClient.post('/system/disable-temp', { duration, reason })
  }

  // Supervision
  async getSupervisedZones(): Promise<Zone[]> {
    return apiClient.get<Zone[]>('/supervision/zones')
  }

  async getZoneSensorData(zoneId: number): Promise<Record<string, unknown>> {
    return apiClient.get(`/supervision/zones/${zoneId}/sensors`)
  }

  // Reports & Analytics
  async getAlertStatistics(): Promise<Record<string, unknown>> {
    return apiClient.get('/reports/alerts-stats')
  }

  async getSystemReport(): Promise<Record<string, unknown>> {
    return apiClient.get('/reports/system')
  }

  async getHistoricalData(startDate: string, endDate: string): Promise<Record<string, unknown>> {
    return apiClient.get(`/reports/history?start=${startDate}&end=${endDate}`)
  }
}

export default new SystemService()
