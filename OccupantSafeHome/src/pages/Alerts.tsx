import { useState } from 'react'
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import ThermostatOutlinedIcon from '@mui/icons-material/ThermostatOutlined'
import PlaceIcon from '@mui/icons-material/Place'
import WifiIcon from '@mui/icons-material/Wifi'
import BarChartIcon from '@mui/icons-material/BarChart'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CelebrationIcon from '@mui/icons-material/Celebration'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Alert {
  id: number
  type: string
  severity: 'critical' | 'warning' | 'normal'
  zone: string
  message: string
  time: string
  sensor: string
  value: number | string
  resolved?: boolean
}

function Alerts() {
  const [activeTab, setActiveTab] = useState('all')
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: 'Smoke',
      severity: 'critical',
      zone: 'Garage',
      message: 'Excessive smoke detected',
      time: '5 minutes ago',
      sensor: 'Smoke Sensor #4',
      value: '850 ppm',
      resolved: false,
    },
    {
      id: 2,
      type: 'Gas',
      severity: 'warning',
      zone: 'Kitchen',
      message: 'Gas level detected',
      time: '12 minutes ago',
      sensor: 'Gas Sensor #2',
      value: '450 ppm',
      resolved: false,
    },
    {
      id: 3,
      type: 'Temperature',
      severity: 'normal',
      zone: 'Living Room',
      message: 'Abnormal temperature deviation',
      time: '1 hour ago',
      sensor: 'Temp Sensor #1',
      value: '42°C',
      resolved: true,
    },
    {
      id: 4,
      type: 'Smoke',
      severity: 'warning',
      zone: 'Bedroom',
      message: 'Sensor test successful',
      time: '2 hours ago',
      sensor: 'Smoke Sensor #3',
      value: '45 ppm',
      resolved: true,
    },
    {
      id: 5,
      type: 'Gas',
      severity: 'critical',
      zone: 'Garage',
      message: 'Severe gas leak detected',
      time: '3 hours ago',
      sensor: 'Gas Sensor #4',
      value: '1200 ppm',
      resolved: true,
    },
  ])

  const getAlertIcon = (type: string) => {
    if (type === 'Smoke') return <LocalFireDepartmentOutlinedIcon style={{ color: '#ef4444', fontSize: 28 }} />
    if (type === 'Gas') return <ScienceOutlinedIcon style={{ color: '#f97316', fontSize: 28 }} />
    return <ThermostatOutlinedIcon style={{ color: '#22c55e', fontSize: 28 }} />
  }

  const getSeverityColor = (severity: string) => {
    if (severity === 'critical') return 'danger'
    if (severity === 'warning') return 'warn'
    return 'normal'
  }

  const getTabCounts = () => {
    const all = alerts.length
    const active = alerts.filter(a => !a.resolved).length
    const resolved = alerts.filter(a => a.resolved).length
    return { all, active, resolved }
  }

  const filteredAlerts = alerts.filter(a => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return !a.resolved
    if (activeTab === 'resolved') return a.resolved
    return true
  })

  const counts = getTabCounts()

  const markAsResolved = (id: number) => {
    setAlerts(alerts.map(a => (a.id === id ? { ...a, resolved: true } : a)))
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Alerts & Events</div>
        <div className="page-desc">Monitor and manage all security alerts from your safety system</div>
      </div>

      {/* Stats Cards */}
      <div className="grid-3 section-gap">
        <div className="stat-card blue">
          <div className="stat-icon"><BarChartIcon style={{ color: '#3b82f6', fontSize: 28 }} /></div>
          <div className="stat-value">{counts.all}</div>
          <div className="stat-label">Total Alerts</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon"><LocalFireDepartmentOutlinedIcon style={{ color: '#ef4444', fontSize: 28 }} /></div>
          <div className="stat-value">{counts.active}</div>
          <div className="stat-label">Active Alerts</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><CheckCircleIcon style={{ color: '#22c55e', fontSize: 28 }} /></div>
          <div className="stat-value">{counts.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      {/* Tab Group */}
      <div className="tabs section-gap">
        <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          All <span className="badge badge-gray">{counts.all}</span>
        </button>
        <button className={`tab ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
          Active <span className={`badge ${counts.active > 0 ? 'badge-danger' : 'badge-gray'}`}>{counts.active}</span>
        </button>
        <button className={`tab ${activeTab === 'resolved' ? 'active' : ''}`} onClick={() => setActiveTab('resolved')}>
          Resolved <span className="badge badge-gray">{counts.resolved}</span>
        </button>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length > 0 ? (
        <div className="card section-gap">
          {filteredAlerts.map((alert, idx) => (
            <div
              key={alert.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '18px',
                borderBottom: idx < filteredAlerts.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'all 0.2s',
              }}
              className="alert-row"
            >
              {/* Alert Icon */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor:
                    alert.severity === 'critical'
                      ? 'rgba(239, 68, 68, 0.12)'
                      : alert.severity === 'warning'
                      ? 'rgba(249, 115, 22, 0.12)'
                      : 'rgba(16, 185, 129, 0.12)',
                }}
              >
                {getAlertIcon(alert.type)}
              </div>

              {/* Alert Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{alert.type} Alert</span>
                  <span className={`badge badge-${getSeverityColor(alert.severity)}`} style={{ textTransform: 'uppercase', fontSize: 10 }}>
                    {alert.severity}
                  </span>
                  {alert.resolved && <span className="badge badge-green" style={{ fontSize: 10 }}><CheckCircleIcon style={{ fontSize: 12, color: '#22c55e' }} /> Resolved</span>}
                </div>

                <div style={{ fontSize: 14, color: 'var(--text)', marginBottom: 8, fontWeight: 500 }}>
                  {alert.message}
                </div>

                <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--text2)' }}>
                  <span><PlaceIcon style={{ fontSize: 14, color: '#3b82f6' }} /> <strong>{alert.zone}</strong></span>
                  <span><WifiIcon style={{ fontSize: 14, color: '#22c55e' }} /> {alert.sensor}</span>
                  <span><BarChartIcon style={{ fontSize: 14, color: '#8b5cf6' }} /> {alert.value}</span>
                  <span><AccessTimeIcon style={{ fontSize: 14, color: '#f59e0b' }} /> {alert.time}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button className="btn btn-secondary btn-sm">Details</button>
                {!alert.resolved && (
                  <button className="btn btn-primary btn-sm" onClick={() => markAsResolved(alert.id)}>Resolve</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card section-gap" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}><CelebrationIcon style={{ fontSize: 48, color: '#22c55e' }} /></div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
            {activeTab === 'resolved' ? 'No Resolved Alerts' : 'All Clear!'}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text2)' }}>
            Everything is secure. Your safety system is operating normally.
          </div>
        </div>
      )}
    </div>
  )
}

export default Alerts
