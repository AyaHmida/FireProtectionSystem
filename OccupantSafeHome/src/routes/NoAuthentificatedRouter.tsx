import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ResetPassword from '../pages/ResetPassword'
import AcceptInvitation from '../pages/AcceptInvitation'

/**
 * NoAuthentificatedRouter
 * Routes accessibles sans authentification (sans token)
 * Login, Register, ResetPassword, AcceptInvitation
 */
export const NoAuthentificatedRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/accept-invitation" element={<AcceptInvitation />} />
      {/* Redirection par défaut vers login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default NoAuthentificatedRouter
 