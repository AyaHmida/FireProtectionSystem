import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7182/api'

export interface AuthError extends Error {
  message: string
  errors?: { [key: string]: string[] }
  details?: string
}

// Réponse du backend pour Login
interface AuthResponseDto {
  success: boolean
  message: string
  token?: string
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
  }
}

class AuthService {
  private notifyAuthChange() {
    // Créer et dispatcher un événement custom
    window.dispatchEvent(new Event('authChanged'))
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      const data: AuthResponseDto = await response.json()

      // Gestion du statut et de la réponse du backend
      if (!response.ok || !data.success) {
        const error: AuthError = new Error(data.message || 'Erreur de connexion') as AuthError
        error.message = data.message || 'Une erreur est survenue'
        error.details = data.message
        throw error
      }

      // Stockage sécurisé
      if (data.token) {
        localStorage.setItem('authToken', data.token)
      }

      if (data.user) {
        // Stocker uniquement les infos minimales pour l'affichage et vérification du rôle
        const authUser = {
          id: data.user.id,
          email: data.user.email,
          name: `${data.user.firstName} ${data.user.lastName}`,
          role: data.user.role
        }
        localStorage.setItem('auth_user', JSON.stringify(authUser))
      }

      // Notifier les changements d'authentification
      this.notifyAuthChange()

      // Retourner la réponse dans le format attendu
      return {
        accessToken: data.token || '',
        user: data.user ? {
          id: data.user.id,
          name: `${data.user.firstName} ${data.user.lastName}`,
          email: data.user.email,
          role: data.user.role.toLowerCase() as 'owner' | 'member' | 'observer',
          createdAt: new Date().toISOString()
        } : {} as any
      }
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        const err: AuthError = new Error('Serveur non accessible') as AuthError
        err.message = 'Le serveur ne répond pas correctement'
        throw err
      }
      throw error
    }
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    // Gestion des erreurs de validation (400)
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}))
      const error: AuthError = new Error() as AuthError
      error.message = errorData.message || 'Validation error'
      error.errors = errorData.errors || errorData
      throw error
    }

    // Gestion des erreurs de conflit (409) - email déjà utilisé
    if (response.status === 409) {
      const errorData = await response.json().catch(() => ({}))
      const error: AuthError = new Error() as AuthError
      error.message = errorData.message || 'Email is already registered.'
      throw error
    }

    // Gestion des autres erreurs
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error: AuthError = new Error() as AuthError
      error.message = errorData.message || 'Registration error'
      throw error
    }

    // Success 201 Created
    const result = await response.json()

    // Note: Le backend ne retourne pas de token après l'inscription
    // L'utilisateur doit se connecter pour obtenir le token
    // On n'a pas besoin de stocker auth_user ici car c'est l'inscription
    return {
      accessToken: '',
      user: {
        id: result.id,
        name: `${result.firstName} ${result.lastName}`,
        email: result.email,
        phone: result.phoneNumber,
        role: result.role.toLowerCase() as 'owner' | 'member' | 'observer',
        createdAt: result.createdAt || new Date().toISOString()
      }
    }
  }

  async resetPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error('Password reset request failed')
    }

    return response.json()
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken')
    localStorage.removeItem('auth_user')
    localStorage.removeItem('user')
    localStorage.removeItem('refreshToken')
    
    // Notifier les changements d'authentification
    this.notifyAuthChange()
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken')
  }

  getAuthUser(): { id: string; email: string; name: string; role: string } | null {
    const authUser = localStorage.getItem('auth_user')
    return authUser ? JSON.parse(authUser) : null
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken()
  }

  hasRole(role: string): boolean {
    const authUser = this.getAuthUser()
    return authUser ? authUser.role.toLowerCase() === role.toLowerCase() : false
  }
}

export default new AuthService()
