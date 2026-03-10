import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SensorsIcon from '@mui/icons-material/Sensors';
import TimerIcon from '@mui/icons-material/Timer';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
interface Zone {
  id: number
  name: string
  status: 'ok' | 'warn' | 'danger'
  temp: number
  gas: number
  smoke: number
  sensors: number
  online: number
}

interface Alert {
  id: number
  type: string
  zone: string
  severity: 'critical' | 'warning' | 'normal'
  time: string
  value: string
  resolved: boolean
}

function Dashboard() {
  const zones: Zone[] = [
    { id: 1, name: 'Living Room', status: 'ok', temp: 23.4, gas: 42, smoke: 0.8, sensors: 3, online: 3 },
    { id: 2, name: 'Kitchen', status: 'warn', temp: 31.2, gas: 180, smoke: 3.1, sensors: 2, online: 2 },
    { id: 3, name: 'Bedroom', status: 'ok', temp: 22.1, gas: 35, smoke: 0.3, sensors: 2, online: 2 },
    { id: 4, name: 'Garage', status: 'danger', temp: 28.5, gas: 650, smoke: 12.4, sensors: 2, online: 1 },
    { id: 5, name: 'Garden', status: 'ok', temp: 19.8, gas: 30, smoke: 0.1, sensors: 1, online: 1 },
  ]

  const alerts: Alert[] = [
    { id: 1, type: 'SMOKE', zone: 'Garage', severity: 'critical', time: '5 min ago', value: '12.4 ppm', resolved: false },
    { id: 2, type: 'GAS', zone: 'Kitchen', severity: 'warning', time: '1h ago', value: '180 ppm', resolved: false },
    { id: 3, type: 'TEMPERATURE', zone: 'Kitchen', severity: 'warning', time: '2h ago', value: '31.2°C', resolved: true },
  ]

  const alertsActives = alerts.filter(a => !a.resolved).length
  const zonesOk = zones.filter(z => z.status === 'ok').length
  const zonesDanger = zones.filter(z => z.status === 'danger').length
  const chartHeights = [40, 65, 30, 80, 55, 70, 45, 90, 60, 75, 40, 85]

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-desc">
          Real-time overview of your fire safety system
        </div>
      </div>

     {zonesDanger > 0 && (
  <div
    style={{
      background: 'rgba(153, 27, 27, 0.95)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: 12,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      color: '#fff',
      fontWeight: 600,
      boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
      backdropFilter: 'blur(4px)',
      marginBottom: 16,
    }}
  >
    <span style={{ fontSize: 20 }}>🚨</span>

    <div>
      <strong>{zonesDanger} zone(s) in critical state!</strong> — Check the Garage immediately.
    </div>

    <button
      className="btn btn-light btn-sm"
      style={{ marginLeft: 'auto', fontWeight: 700 }}
    >
      View Alerts
    </button>
  </div>
)}


    <div className="grid-4 section-gap">
  <div className="stat-card green">
    <div className="stat-icon">
      <CheckCircleIcon fontSize="large" />
    </div>
    <div className="stat-value">
      {zonesOk}/{zones.length}
    </div>
    <div className="stat-label">Zones Normal</div>
    <div className="stat-trend">System Operational</div>
  </div>

  <div className="stat-card danger">
    <div className="stat-icon">
      <ErrorIcon fontSize="large" />
    </div>
    <div className="stat-value">{alertsActives}</div>
    <div className="stat-label">Unresolved Alerts</div>
    <div className="stat-trend" style={{ color: 'var(--danger)' }}>
      Action Required
    </div>
  </div>

  <div className="stat-card blue">
    <div className="stat-icon">
      <SensorsIcon fontSize="large" />
    </div>
    <div className="stat-value">9/10</div>
    <div className="stat-label">Sensors Online</div>
    <div className="stat-trend">1 Offline</div>
  </div>

  <div className="stat-card warn">
    <div className="stat-icon">
      <TimerIcon fontSize="large" />
    </div>
    <div className="stat-value">2.1s</div>
    <div className="stat-label">Avg Response Time</div>
    <div className="stat-trend" style={{ color: 'var(--accent)' }}>
      &lt; 3s Required
    </div>
  </div>
</div>


      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Alert Activity (7 Days)</span>
            <span className="badge badge-blue">Weekly</span>
          </div>
          <div className="chart-placeholder">
            <div className="chart-bars">
              {chartHeights.map((h, i) => (
                <div key={i} className="chart-bar" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 8,
              fontSize: 11,
              color: 'var(--text3)',
              fontFamily: 'var(--mono)',
            }}
          >
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Alerts</span>
            <span className="badge badge-danger">{alertsActives} Active</span>
          </div>
          {alerts.slice(0, 3).map(alert => (
            <div className="alert-item" key={alert.id}>
              <div className={`alert-dot ${alert.severity}`} />
              <div className="alert-content">
                <div className="alert-title">
                  {alert.type} — {alert.zone}
                </div>
                <div className="alert-meta">
                  {alert.time} • {alert.value}
                </div>
              </div>
              <span
                className={`badge badge-${alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warn' : 'green'}`}
              >
                {alert.resolved ? 'Resolved' : alert.severity}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
  <div className="card-header">
    <span className="card-title">Zone Status</span>

    <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <CheckCircleIcon fontSize="small" style={{ color: 'var(--success)' }} />
        Normal
      </span>

      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <WarningAmberIcon fontSize="small" style={{ color: 'var(--warn)' }} />
        Warning
      </span>

      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <ErrorIcon fontSize="small" style={{ color: 'var(--danger)' }} />
        Critical
      </span>
    </div>
  </div>

  <div className="zone-grid">
    {zones.map(z => (
      <div className={`zone-card ${z.status}`} key={z.id}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 8,
          }}
        >
          <div className="zone-name">{z.name}</div>

          <span className={`zone-status-badge ${z.status}`}>
            {z.status === 'ok' && (
              <>
                <CheckCircleIcon fontSize="small" /> Normal
              </>
            )}

            {z.status === 'warn' && (
              <>
                <WarningAmberIcon fontSize="small" /> Warning
              </>
            )}

{z.status !== 'ok' && z.status !== 'warn' && (
              <>
                <ErrorIcon fontSize="small" /> Critical
              </>
            )}
          </span>
        </div>

        <div
          style={{
            fontSize: 11,
            color: 'var(--text2)',
            fontFamily: 'var(--mono)',
            marginBottom: 10,
          }}
        >
          {z.online}/{z.sensors} Sensors Active
        </div>

        <div className="zone-metrics">
          <div className="zone-metric">
            <div
              className="zone-metric-val"
              style={{
                color: z.temp > 28 ? 'var(--warn)' : 'var(--text)',
              }}
            >
              {z.temp}°C
            </div>
            <div className="zone-metric-label">Temp</div>
          </div>

          <div className="zone-metric">
            <div
              className="zone-metric-val"
              style={{
                color:
                  z.gas > 500
                    ? 'var(--danger)'
                    : z.gas > 100
                    ? 'var(--warn)'
                    : 'var(--text)',
              }}
            >
              {z.gas}
            </div>
            <div className="zone-metric-label">Gas (ppm)</div>
          </div>

          <div className="zone-metric">
            <div
              className="zone-metric-val"
              style={{
                color:
                  z.smoke > 5
                    ? 'var(--danger)'
                    : z.smoke > 2
                    ? 'var(--warn)'
                    : 'var(--text)',
              }}
            >
              {z.smoke}
            </div>
            <div className="zone-metric-label">Smoke</div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  )
}

export default Dashboard
