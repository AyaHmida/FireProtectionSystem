import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Dashboard from '../pages/Dashboard'
import Settings from '../pages/Settings'
import Reports from '../pages/Reports'
import Devices from '../pages/Devices'
import NotFound from '../pages/NotFound'
import Control from '../pages/Control'
import Alerts from '../pages/Alerts'
import Contacts from '../pages/Contacts'
import Family from '../pages/Family'
import Profile from '../pages/Profile'
import Supervision from '../pages/Supervision'

/**
 * AuthentificatedRouter
 * Routes accessibles uniquement avec authentification (avec token)
 * Toutes les routes protégées de l'application
 */
export const AuthentificatedRouter = () => {
  const handlePageChange = (): void => {
    // Page change is handled by Navigation
  }

  return (
    <Routes>
      <Route element={<Layout onPageChange={handlePageChange} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="devices" element={<Devices />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="control" element={<Control />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="family" element={<Family />} />
        <Route path="profile" element={<Profile />} />
        <Route path="supervision" element={<Supervision />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AuthentificatedRouter
