// Configuration de base pour les appels API
const API_BASE_URL = 'https://localhost:7182/api';

// Pages publiques qui ne nécessitent pas de redirection sur 401
const PUBLIC_AUTH_PAGES = ['/login', '/register', '/forgot-password'];

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Utilitaire pour faire des appels API avec gestion automatique du token
 */
export const apiClient = {
  async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('auth_token');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Si non authentifié (401), nettoyer le localStorage
    // Mais ne pas rediriger si on est déjà sur une page d'authentification
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Rediriger seulement si on n'est pas sur une page publique
      const currentPath = window.location.pathname;
      if (!PUBLIC_AUTH_PAGES.includes(currentPath)) {
        window.location.href = '/login';
      }
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
      const err: any = new Error(errorBody.message || `HTTP ${response.status}`);
      err.body = errorBody;
      err.status = response.status;
      throw err;
    }

    return response.json();
  },

  get<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, data?: any, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(endpoint: string, data?: any, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  patch<T>(endpoint: string, data?: any, options?: FetchOptions) {
  return this.request<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
},

  delete<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
