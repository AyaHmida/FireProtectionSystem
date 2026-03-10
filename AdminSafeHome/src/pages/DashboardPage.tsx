import React from 'react';
import { useNavigate } from 'react-router-dom';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import HourglassTopOutlinedIcon from '@mui/icons-material/HourglassTopOutlined';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ElectricBoltOutlinedIcon from '@mui/icons-material/ElectricBoltOutlined';

const mockAlerts = [
  { id: 1, type: 'SMOKE', zone: 'Garage', severity: 'critical', time: '14:32', val: '650ppm', resolved: false },
  { id: 2, type: 'GAS', zone: 'Kitchen', severity: 'warning', time: '13:15', val: '180ppm', resolved: false },
  { id: 3, type: 'TEMPERATURE', zone: 'Kitchen', severity: 'warning', time: '12:00', val: '31.2°C', resolved: true },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const bars = [60, 80, 45, 95, 70, 55, 85, 40, 75, 60, 90, 50];

  return (
    <div>
      <div className="page-hd">
        <div className="page-title">Administrator Dashboard</div>
        <div className="page-desc">Global system supervision view in real-time</div>
      </div>
      
      <div className="alert-banner critical">
        <WarningOutlinedIcon sx={{ fontSize: 20, color: '#ef4444', marginRight: 1.5 }} />
        <strong>1 unresolved critical alert</strong> — Garage zone. Immediate attention required.
        <button className="btn btn-sm btn-danger" style={{ marginLeft: 'auto' }} onClick={() => navigate('/alerts')}>View →</button>
      </div>

      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-glow purple" />
          <div className="kpi-icon"><HourglassTopOutlinedIcon sx={{ fontSize: 32, color: '#8b5cf6' }} /></div>
          <div className="kpi-val" style={{ color: 'var(--green)' }}>99.97%</div>
          <div className="kpi-lbl">Server Uptime</div>
          <div className="kpi-sub">↑ &gt; 99% required</div>
        </div>

        <div className="kpi">
          <div className="kpi-glow red" />
          <div className="kpi-icon"><ErrorOutlinedIcon sx={{ fontSize: 32, color: '#ef4444' }} /></div>
          <div className="kpi-val" style={{ color: 'var(--danger)' }}>2</div>
          <div className="kpi-lbl">Active Alerts</div>
          <div className="kpi-sub">1 critical, 1 attention</div>
        </div>

        <div className="kpi">
          <div className="kpi-glow warn" />
          <div className="kpi-icon"><SignalCellularAltOutlinedIcon sx={{ fontSize: 32, color: '#f59e0b' }} /></div>
          <div className="kpi-val" style={{ color: 'var(--warn)' }}>2</div>
          <div className="kpi-lbl">Faulty Sensors</div>
          <div className="kpi-sub">1 offline, 1 maintenance</div>
        </div>

        <div className="kpi">
          <div className="kpi-glow cyan" />
          <div className="kpi-icon"><PeopleOutlinedIcon sx={{ fontSize: 32, color: '#06b6d4' }} /></div>
          <div className="kpi-val" style={{ color: 'var(--accent2)' }}>4</div>
          <div className="kpi-lbl">Active Users</div>
          <div className="kpi-sub">1 pending</div>
        </div>

        <div className="kpi">
          <div className="kpi-glow green" />
          <div className="kpi-icon"><ElectricBoltOutlinedIcon sx={{ fontSize: 32, color: '#10b981' }} /></div>
          <div className="kpi-val" style={{ color: 'var(--green)' }}>1.8s</div>
          <div className="kpi-lbl">Response Time</div>
          <div className="kpi-sub">✓ Nominal</div>
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-hd">
            <span className="card-ttl">System Activity (24h)</span>
            <span className="bd bd-blue">Real-time</span>
          </div>
          <div style={{ height: 130, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: `linear-gradient(180deg,${
                    i === bars.length - 1 ? 'var(--primary)' : 'var(--info)'
                  },transparent)`,
                  borderRadius: '3px 3px 0 0',
                  opacity: i === bars.length - 1 ? 1 : 0.6,
                  transition: '.3s',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--text-tertiary)' }}>
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <span className="card-ttl">Services Status</span>
          </div>
          {[
            { name: 'API Backend (ASP.NET)', st: 'online', lat: '12ms' },
            { name: 'Broker MQTT (Mosquitto)', st: 'online', lat: '3ms' },
            { name: 'SQL Database', st: 'online', lat: '8ms' },
            { name: 'SignalR Hub', st: 'online', lat: '5ms' },
            { name: 'Email Service (SMTP)', st: 'warn', lat: '—' },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div
                className={`s-dot ${
                  s.st === 'online'
                    ? 'online'
                    : s.st === 'warn'
                    ? 'maintenance'
                    : 'offline'
                }`}
                style={{ marginRight: 8 }}
              />
              <span style={{ flex: 1, fontSize: 13, color: 'var(--text-secondary)' }}>{s.name}</span>
              <span className={`bd ${s.st === 'online' ? 'bd-green' : 'bd-warn'}`}>
                {s.st === 'online' ? 'Operational' : 'Degraded'}
              </span>
              <span style={{ marginLeft: 12, fontSize: 12, color: 'var(--text-tertiary)', width: 36, textAlign: 'right' }}>
                {s.lat}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-hd">
          <span className="card-ttl">Latest System Alerts</span>
          <button className="btn btn-sm btn-secondary">View all</button>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Type</th>
              <th>Zone</th>
              <th>Severity</th>
              <th>Time</th>
              <th>Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockAlerts.map((a) => (
              <tr key={a.id}>
                <td>
                  <strong>{a.type}</strong>
                </td>
                <td>{a.zone}</td>
                <td>
                  <span className={`bd ${a.severity === 'critical' ? 'bd-red' : 'bd-warn'}`}>
                    {a.severity}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                  {a.time}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{a.val}</td>
                <td>
                  <span className={`bd ${a.resolved ? 'bd-green' : 'bd-red'}`}>
                    {a.resolved ? 'Resolved' : 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
