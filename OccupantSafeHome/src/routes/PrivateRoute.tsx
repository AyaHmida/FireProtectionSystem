import { Navigate } from 'react-router-dom'
import { authService } from '../services'

interface PrivateRouteProps {
  children: JSX.Element
}

/**
 * PrivateRoute - Protège les routes qui nécessitent une authentification
 * Si l'utilisateur n'a pas de token, il est redirigé vers /login
 */
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = authService.isAuthenticated()

  if (!isAuthenticated) {
    // Pas authentifié → Redirection vers login
    return <Navigate to="/login" replace />
  }

  // Authentifié → Afficher la page
  return children
}

export default PrivateRoute
