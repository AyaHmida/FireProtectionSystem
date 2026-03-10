import { useState, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import AuthService from '../services/authService'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import DevicesOtherOutlinedIcon from '@mui/icons-material/DevicesOtherOutlined'
import StackedLineChartOutlinedIcon from '@mui/icons-material/StackedLineChartOutlined'
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined'
import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined'
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'

interface LayoutProps {
  onPageChange: (page: string) => void
}

function Layout({ onPageChange }: LayoutProps) {
  const location = useLocation()
  const [user] = useState(AuthService.getAuthUser())
  const [notifOpen, setNotifOpen] = useState(false)

  const allNavItems = [
    { id: 'dashboard', icon: HomeOutlinedIcon, label: 'Dashboard' },
    { id: 'supervision', icon: VisibilityOutlinedIcon, label: 'Supervision', section: 'Monitoring' },
    { id: 'devices', icon: DevicesOtherOutlinedIcon, label: 'Devices' },
    { id: 'reports', icon: StackedLineChartOutlinedIcon, label: 'Reports', badge: '2', badgeType: 'danger' },
    { id: 'alerts', icon: CircleNotificationsOutlinedIcon, label: 'Alerts', badge: '1', badgeType: 'danger' },
    { id: 'control', icon: SpeakerNotesOutlinedIcon, label: 'Control', section: 'Management' },
    { id: 'contacts', icon: ContactsOutlinedIcon, label: 'Contacts' },
    { id: 'family', icon: GroupOutlinedIcon, label: 'Family', section: 'Community', requiredRole: 'Occupant' as const },
    { id: 'profile', icon: PersonOutlinedIcon, label: 'Profile', section: 'Account' },
    { id: 'settings', icon: SettingsOutlinedIcon, label: 'Settings' },
  ]

  // Filtrer les items selon le rôle - Family uniquement pour Occupant
  const navItems = useMemo(() => {
    return allNavItems.filter(item => {
      if (item.requiredRole && user?.role !== item.requiredRole) {
        return false
      }
      return true
    })
  }, [user?.role])

  const currentPagePath = location.pathname.replace('/', '')
  const currentNavItem = navItems.find(n => n.id === currentPagePath)
  const pageTitle = currentNavItem?.label || 'Dashboard'

  return (
    <div className="app-layout">
      <Sidebar navItems={navItems} currentPage={currentPagePath} onPageChange={onPageChange} />
      <div className="main">
        <Topbar title={pageTitle} onNotifToggle={() => setNotifOpen(!notifOpen)} notifOpen={notifOpen} />
        <div className="page">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
