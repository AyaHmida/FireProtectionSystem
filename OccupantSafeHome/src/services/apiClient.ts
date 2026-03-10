import { ApiResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7182/api'

class ApiClient {
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const token = localStorage.getItem('authToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })

    if (response.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }

    if (!response.ok) {
      try {
        const errorData = await response.json()
        throw new Error(errorData.message || `API Error: ${response.statusText}`)
      } catch (e) {
        if (e instanceof Error) throw e
        throw new Error(`API Error: ${response.statusText}`)
      }
    }

    const data: ApiResponse<T> = await response.json()
    return data.data!
  }

  async post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    })

    if (response.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }

    if (!response.ok) {
      try {
        const errorData = await response.json()
        throw new Error(errorData.message || `API Error: ${response.statusText}`)
      } catch (e) {
        if (e instanceof Error) throw e
        throw new Error(`API Error: ${response.statusText}`)
      }
    }

    const data: ApiResponse<T> = await response.json()
    return data.data!
  }

  async put<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    })

    if (response.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    const data: ApiResponse<T> = await response.json()
    return data.data!
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    if (response.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }

    if (!response.ok) {
      try {
        const errorData = await response.json()
        throw new Error(errorData.message || `API Error: ${response.statusText}`)
      } catch (e) {
        if (e instanceof Error) throw e
        throw new Error(`API Error: ${response.statusText}`)
      }
    }

    const data: ApiResponse<T> = await response.json()
    return data.data!
  }
}

export default new ApiClient()
