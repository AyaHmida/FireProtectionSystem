import { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { authService } from './services'
import { PrivateRoute, NoAuthentificatedRouter, AuthentificatedRouter } from './routes'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated())

  useEffect(() => {
    // Monitorer les changements d'authentification
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated())
    }

    // Écouter l'événement personnalisé authChanged
    window.addEventListener('authChanged', checkAuth)
    
    return () => window.removeEventListener('authChanged', checkAuth)
  }, [])

  return (
    <Router>
      {isAuthenticated ? <AuthentificatedRouter /> : <NoAuthentificatedRouter />}
    </Router>
  )
}

export default App
