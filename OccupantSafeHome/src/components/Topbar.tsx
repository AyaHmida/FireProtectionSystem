import { useNavigate } from 'react-router-dom'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import AuthService from '../services/authService'


interface TopbarProps {
  title: string
  onNotifToggle: () => void
  notifOpen: boolean
}

function Topbar({ title, onNotifToggle, notifOpen }: TopbarProps) {
  const navigate = useNavigate()

  const handleLogout = async () => {
  await AuthService.logout()
  navigate('/login')
}

  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        <div className="topbar-sub">SafeHome — Système Anti-Incendie</div>
      </div>
      <div className="topbar-actions">
        <div className="status-pill">
          <div className="status-dot" />
          Système Actif
        </div>
        <div style={{ position: 'relative' }}>
          <div className="icon-btn" onClick={onNotifToggle} title="Notifications">
            <NotificationsOutlinedIcon fontSize="small" />

          </div>
          {notifOpen && (
            <div className="notif-panel">
              <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 13 }}>
                Notifications
              </div>
              <div className="notif-item">
<div className="notif-icon danger">
  <ErrorOutlineIcon fontSize="small" />
</div>                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>
                    Alerte Critique — Garage
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--text2)',
                      fontFamily: 'var(--mono)',
                    }}
                  >
                    Il y a 5 min
                  </div>
                </div>
              </div>
              <div className="notif-item">
<div className="notif-icon warn">
  <WarningAmberOutlinedIcon fontSize="small" />
</div>                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>
                    Gaz élevé — Cuisine
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--text2)',
                      fontFamily: 'var(--mono)',
                    }}
                  >
                    Il y a 1h
                  </div>
                </div>
              </div>
              <div className="notif-item">
<div className="notif-icon info">
  <InfoOutlinedIcon fontSize="small" />
</div>                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>
                    Capteur connecté
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--text2)',
                      fontFamily: 'var(--mono)',
                    }}
                  >
                    Il y a 2h
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
  className="icon-btn"
  onClick={handleLogout}
  title="Déconnexion"
  style={{ color: 'var(--danger)', cursor: 'pointer' }}
>
  <LogoutOutlinedIcon fontSize="small" />
</div>

      </div>
    </div>
  )
}

export default Topbar
