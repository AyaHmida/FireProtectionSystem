import { LoginDto, AuthResponseDto, UserDto } from '../types';
import { apiClient } from './api';

/**
 * Service d'authentification
 * Gère les appels API pour login et logout
 */
export const authService = {
  /**
   * Authentifie l'utilisateur avec email et mot de passe
   * @param dto Données de connexion (email, password)
   * @returns Réponse du serveur avec token et user
   */
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    try {
      const response = await apiClient.post<AuthResponseDto>('/auth/login', dto);
      
      if (response.success && response.token && response.user) {
        // Sauvegarder le token et les données utilisateur
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Déconnecte l'utilisateur en supprimant le token
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  /**
   * Récupère le token stocké
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  /**
   * Récupère l'utilisateur stocké
   */
  getUser(): UserDto | null {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  },
};
