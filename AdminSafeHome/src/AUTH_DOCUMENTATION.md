/**
 * SYSTÈME D'AUTHENTIFICATION - DOCUMENTATION
 * ============================================
 * 
 * Architecture complète et bien structurée pour l'authentification avec JWT
 * 
 * FILES:
 * ------
 * 1. src/types/index.ts
 *    - LoginDto: Données de connexion (email, password)
 *    - UserDto: Données utilisateur du backend
 *    - AuthResponseDto: Réponse du serveur (success, message, token, user)
 *    - AuthUser: Type local pour l'app (avec firstName, lastName, email, role)
 *    - AuthContextType: Type du contexte d'authentification
 * 
 * 2. src/services/api.ts
 *    - apiClient: Client HTTP générique
 *    - Gestion automatique du token dans les headers
 *    - Redirection auto vers /login si 401
 *    - Méthodes: get<T>, post<T>, put<T>, delete<T>
 * 
 * 3. src/services/authService.ts
 *    - login(dto): Fait l'appel API et sauvegarde token + user
 *    - logout(): Nettoie le localStorage
 *    - getToken(): Récupère le token stocké
 *    - getUser(): Récupère l'utilisateur stocké
 *    - isAuthenticated(): Vérifie l'authentification
 * 
 * 4. src/contexts/AuthContext.tsx
 *    - AuthContext: Contexte React
 *    - AuthProvider: Provider avec logique d'initialisation
 *    - Gère: user, token, isAuthenticated, isLoading, error
 *    - Appelle authService.login pendant le login
 * 
 * 5. src/hooks/useAuth.ts
 *    - Hook personnalisé pour accéder au contexte
 *    - S'assure que le hook est utilisé dans un Provider
 * 
 * 6. src/pages/LoginPage.tsx
 *    - Formulaire de connexion
 *    - Affichage des erreurs avec icônes Material-UI
 *    - Indicateur de chargement (isLoading du contexte)
 *    - Redirection automatique après login réussi
 * 
 * FLUX D'AUTHENTIFICATION:
 * ========================
 * 
 * LOGIN:
 * ------
 * User entre email/password
 *  → LoginPage appelle login() du contexte
 *  → AuthContext appelle authService.login(dto)
 *  → authService fait POST /api/auth/login avec les identifiants
 *  → Backend retourne { success, message, token, user }
 *  → authService stocke token dans localStorage['auth_token']
 *  → authService stocke user dans localStorage['auth_user']
 *  → AuthContext met à jour state (user, token, isAuthenticated)
 *  → LoginPage détecte isAuthenticated et redirige vers /dashboard
 * 
 * LOGOUT:
 * -------
 * User clique "Logout" dans UserMenu
 *  → UserMenu appelle logout() du contexte
 *  → AuthContext appelle authService.logout()
 *  → authService supprime token et user du localStorage
 *  → AuthContext remet state (user = null, token = null, isAuthenticated = false)
 *  → UserMenu redirige vers /login
 * 
 * INITIALISATION AU MONTAGE:
 * ---------------------------
 * App démarre
 *  → AuthProvider useEffect init runs
 *  → Récupère token et user du localStorage
 *  → Met à jour state si valides
 *  → User reste loggé même après rechargement
 * 
 * REQUÊTES PROTÉGÉES:
 * -------------------
 * Toute requête via apiClient inclut automatiquement le token:
 *  → Header: Authorization: Bearer {token}
 *  → Si 401: nettoie localStorage et redirige vers /login
 * 
 * UTILISATION:
 * =============
 * 
 * 1. Dans un composant React:
 * 
 *    import { useAuth } from '../hooks/useAuth';
 * 
 *    const MyComponent = () => {
 *      const { user, isAuthenticated, login, logout, isLoading, error } = useAuth();
 *      
 *      return (
 *        <>
 *          {isAuthenticated && <p>Bienvenue {user?.firstName}</p>}
 *          {error && <p>Erreur: {error}</p>}
 *        </>
 *      );
 *    };
 * 
 * 2. Pour faire une requête API:
 * 
 *    import { apiClient } from '../services';
 * 
 *    const response = await apiClient.get<MyType>('/endpoint');
 *    const response = await apiClient.post<MyType>('/endpoint', data);
 * 
 * 3. Pour appeler authService directement:
 * 
 *    import { authService } from '../services';
 *    
 *    const user = authService.getUser();
 *    const isAuth = authService.isAuthenticated();
 * 
 * BACKEND API (C#):
 * =================
 * 
 * POST /api/auth/login
 * Request:
 *   {
 *     "email": "admin@safehome.tn",
 *     "password": "password123"
 *   }
 * 
 * Response (success):
 *   {
 *     "success": true,
 *     "message": "Connection successful.",
 *     "token": "eyJhbGc...",
 *     "user": {
 *       "id": "1",
 *       "firstName": "Admin",
 *       "lastName": "User",
 *       "email": "admin@safehome.tn",
 *       "role": "admin"
 *     }
 *   }
 * 
 * Response (error):
 *   {
 *     "success": false,
 *     "message": "Incorrect email or password.",
 *     "token": null,
 *     "user": null
 *   }
 * 
 * STOCKAGE LOCAL:
 * ===============
 * 
 * localStorage['auth_token']: JWT Token (vide après logout)
 * localStorage['auth_user']: UserDto JSON stringifié (vide après logout)
 * 
 * GESTION D'ERREURS:
 * ==================
 * 
 * - AuthContext capture les erreurs du service
 * - Stocke le message dans state 'error'
 * - LoginPage affiche le message avec icône ErrorOutlineIcon
 * - Hook useAuth expose 'error' pour les autres composants
 * - apiClient redirige automatiquement si 401
 */
