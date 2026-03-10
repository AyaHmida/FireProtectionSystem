import apiClient from './apiClient'
import { User } from '../types'

interface UpdateProfileRequest {
  name?: string
  email?: string
  phone?: string
  address?: string
}

interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface ThresholdSettings {
  temperatureThreshold: number
  gasThreshold: number
  smokeThreshold: number
  responseTime: number
}

class UserService {
  // Profile
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/profile')
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    return apiClient.put<User>('/profile', data as unknown as Record<string, unknown>)
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return apiClient.post('/profile/change-password', data as unknown as Record<string, unknown>)
  }

  async updateAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/profile/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Avatar upload failed')
    }

    return response.json()
  }

  // Settings
  async getThresholdSettings(): Promise<ThresholdSettings> {
    return apiClient.get<ThresholdSettings>('/settings/thresholds')
  }

  async updateThresholdSettings(data: Partial<ThresholdSettings>): Promise<ThresholdSettings> {
    return apiClient.put<ThresholdSettings>('/settings/thresholds', data)
  }

  async getNotificationPreferences(): Promise<Record<string, unknown>> {
    return apiClient.get('/settings/notifications')
  }

  async updateNotificationPreferences(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    return apiClient.put('/settings/notifications', data)
  }

  // Data Management
  async exportUserData(): Promise<Blob> {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/profile/export`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    })

    if (!response.ok) {
      throw new Error('Data export failed')
    }

    return response.blob()
  }

  async deleteAccount(password: string): Promise<{ message: string }> {
    return apiClient.post('/profile/delete-account', { password })
  }

  // Session
  async getActiveSessions(): Promise<Array<Record<string, unknown>>> {
    return apiClient.get('/profile/sessions')
  }

  async revokeAllSessions(): Promise<{ message: string }> {
    return apiClient.post('/profile/revoke-all-sessions', {})
  }

  async revokeSession(sessionId: string): Promise<{ message: string }> {
    return apiClient.post(`/profile/sessions/${sessionId}/revoke`, {})
  }
}

export default new UserService()
