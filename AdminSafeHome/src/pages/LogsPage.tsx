import React, { useState } from 'react';

interface Log {
  id: number;
  ts: string;
  level: string;
  src: string;
  msg: string;
}

const mockLogs: Log[] = [
  { id: 1, ts: '14:32:01', level: 'CRITICAL', src: 'AlertService', msg: 'Smoke detected - Garage - value: 650ppm > 500ppm threshold' },
  { id: 2, ts: '14:31:45', level: 'ERROR', src: 'SensorService', msg: 'Sensor E9:2B:55:C7:05:EE went offline - no heartbeat' },
  { id: 3, ts: '14:28:12', level: 'WARN', src: 'MqttBroker', msg: 'Reconnect attempt #3 for topic home/garage/sensors' },
  { id: 4, ts: '14:25:00', level: 'INFO', src: 'AuthService', msg: 'User ahmed@safehome.tn logged in successfully (JWT issued)' },
  { id: 5, ts: '14:22:30', level: 'INFO', src: 'ApiGateway', msg: 'GET /api/zones/status 200 OK 12ms' },
  { id: 6, ts: '14:20:15', level: 'WARN', src: 'AlertService', msg: 'Gas level elevated - Cuisine - 180ppm (warn threshold: 150ppm)' },
  { id: 7, ts: '14:18:00', level: 'INFO', src: 'SignalRHub', msg: 'Client connected: dashboard-session-abc123' },
  { id: 8, ts: '14:15:44', level: 'INFO', src: 'BackupService', msg: 'Database backup completed successfully - 2.3MB' },
  { id: 9, ts: '14:10:30', level: 'ERROR', src: 'EmailService', msg: 'SMTP delivery failed for contact@emergency.tn - retry queued' },
  { id: 10, ts: '14:08:00', level: 'INFO', src: 'SystemService', msg: 'Server uptime: 99.97% — All core services healthy' },
];

export const LogsPage: React.FC = () => {
  const [filter, setFilter] = useState('TOUS');
  const levels = ['TOUS', 'INFO', 'WARN', 'ERROR', 'CRITICAL'];
  const filtered = filter === 'TOUS' ? mockLogs : mockLogs.filter((l) => l.level === filter);

  return (
    <div>
      <div className="page-hd">
        <div className="page-title">Logs Système</div>
        <div className="page-desc">Consultez et filtrez les événements techniques en temps réel</div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-hd">
          <span className="card-ttl">Filtres</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Auto-refresh: ON</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', animation: 'blink 1s infinite' }} />
          </div>
        </div>
        <div className="filter-bar">
          {levels.map((l) => (
            <div
              key={l}
              className={`filter-chip ${filter === l ? 'active' : ''}`}
              onClick={() => setFilter(l)}
              style={l === 'CRITICAL' && filter !== l ? { borderColor: 'rgba(239,68,68,.3)', color: 'var(--danger)' } : {}}
            >
              {l}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-hd">
          <span className="card-ttl">Journal ({filtered.length} entrées)</span>
          <button className="btn btn-sm btn-secondary">📥 Exporter</button>
        </div>
        <div className="log-console">
          {filtered.length === 0 ? (
            <div style={{ color: 'var(--text3)', textAlign: 'center', padding: 20 }}>Aucun log pour ce niveau</div>
          ) : (
            filtered.map((log) => (
              <div className="log-line" key={log.id}>
                <span className="log-ts">{log.ts}</span>
                <span className={`log-lvl ${log.level}`}>{log.level}</span>
                <span className="log-src">[{log.src}]</span>
                <span className="log-msg">{log.msg}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
