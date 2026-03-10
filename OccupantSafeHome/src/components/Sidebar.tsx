import { useNavigate } from 'react-router-dom'
import { SvgIconProps } from '@mui/material/SvgIcon'
import { ElementType } from 'react'
import AuthService from '../services/authService'
import { useEffect, useState } from 'react'

interface NavItem {
  id: string
  icon: ElementType<SvgIconProps>
  label: string
  section?: string
  badge?: string
  badgeType?: string
  requiredRole?: string
}

interface SidebarProps {
  navItems: NavItem[]
  currentPage: string
  onPageChange: (page: string) => void
}

function Sidebar({ navItems, currentPage, onPageChange }: SidebarProps) {
  const navigate = useNavigate()
  const [user, setUser] = useState(AuthService.getAuthUser())

  let prevSection = ''
useEffect(() => {
  const handleAuthChange = () => {
    setUser(AuthService.getAuthUser())
  }

  window.addEventListener('authChanged', handleAuthChange)

  return () => {
    window.removeEventListener('authChanged', handleAuthChange)
  }
}, [])

  const handleNavClick = (id: string) => {
    onPageChange(id)
    navigate(`/${id}`)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">�</div>
        <div>
          <div className="logo-text">SafeHome</div>
          <div className="logo-sub">Resident Portal</div>
        </div>
      </div>

      <ul className="nav-menu">
        {navItems.map(item => {
          const showSection = item.section && item.section !== prevSection
          if (showSection) prevSection = item.section || ''

          return (
            <li key={item.id}>
              {showSection && (
                <div className="nav-section">
                  <div className="nav-label">{item.section}</div>
                </div>
              )}
              <div
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-icon">
                  <item.icon sx={{ fontSize: 20 }} />
                </span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`nav-badge ${item.badgeType || ''}`}>{item.badge}</span>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="sidebar-bottom">
  {user && (
    <div className="user-card">
      <div className="user-avatar">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <div className="user-name">{user.name}</div>
        <div className="user-role">{user.role}</div>
      </div>
    </div>
  )}
</div>

    </aside>
  )
}

export default Sidebar
