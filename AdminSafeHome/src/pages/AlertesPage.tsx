import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import AlertIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import './alertesPage.css';

interface Alert {
  id: number;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: string;
  status: 'unread' | 'read';
  sensorId?: string;
}

export const AlertesPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      message: 'Motion detected in living room - Unusual activity detected',
      type: 'error',
      timestamp: '2024-02-21 14:32:00',
      status: 'unread',
      sensorId: 'MOTION-01',
    },
    {
      id: 2,
      message: 'Door sensor battery low - Replace battery soon',
      type: 'warning',
      timestamp: '2024-02-21 12:15:00',
      status: 'unread',
      sensorId: 'DOOR-02',
    },
    {
      id: 3,
      message: 'Temperature sensor offline - Sensor connection lost',
      type: 'error',
      timestamp: '2024-02-21 10:45:00',
      status: 'read',
      sensorId: 'TEMP-03',
    },
    {
      id: 4,
      message: 'System backup completed successfully',
      type: 'info',
      timestamp: '2024-02-21 08:00:00',
      status: 'read',
    },
    {
      id: 5,
      message: 'Humidity level above threshold in bathroom',
      type: 'warning',
      timestamp: '2024-02-20 16:20:00',
      status: 'read',
      sensorId: 'HUMIDITY-04',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'error' | 'warning' | 'info'>('all');

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return alert.status === 'unread';
    if (filter === 'error') return alert.type === 'error';
    if (filter === 'warning') return alert.type === 'warning';
    if (filter === 'info') return alert.type === 'info';
    return true;
  });

  const markAsRead = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'read' } : a));
  };

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertIcon sx={{ fontSize: 20, color: '#ef4444' }} />;
      case 'warning':
        return <AlertIcon sx={{ fontSize: 20, color: '#f59e0b' }} />;
      case 'info':
        return <InfoIcon sx={{ fontSize: 20, color: '#3b82f6' }} />;
      default:
        return <InfoIcon sx={{ fontSize: 20 }} />;
    }
  };

  const stats = {
    total: alerts.length,
    unread: alerts.filter(a => a.status === 'unread').length,
    errors: alerts.filter(a => a.type === 'error').length,
    warnings: alerts.filter(a => a.type === 'warning').length,
  };

  return (
    <div className="alertes-page">
      {/* Stats Section */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-content">
            <span className="stat-label">Total Alerts</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-content">
            <span className="stat-label">Unread</span>
            <span className="stat-value unread">{stats.unread}</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-content">
            <span className="stat-label">Errors</span>
            <span className="stat-value error">{stats.errors}</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-content">
            <span className="stat-label">Warnings</span>
            <span className="stat-value warning">{stats.warnings}</span>
          </div>
        </Card>
      </div>

      {/* Filter Section */}
      <Card className="filter-card">
        <div className="filter-controls">
          <span className="filter-label">Filter:</span>
          <div className="filter-buttons">
            {(['all', 'unread', 'error', 'warning', 'info'] as const).map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      <div className="alerts-list">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`alert-item ${alert.type} ${alert.status}`}
            >
              <div className="alert-icon">
                {getAlertIcon(alert.type)}
              </div>
              <div className="alert-content">
                <p className="alert-message">{alert.message}</p>
                <div className="alert-meta">
                  <span className="alert-timestamp">{alert.timestamp}</span>
                  {alert.sensorId && <span className="alert-sensor">{alert.sensorId}</span>}
                </div>
              </div>
              <div className="alert-actions">
                {alert.status === 'unread' && (
                  <button
                    className="action-btn mark-read"
                    onClick={() => markAsRead(alert.id)}
                    title="Mark as read"
                  >
                    <CheckCircleIcon sx={{ fontSize: 18 }} />
                  </button>
                )}
                <button
                  className="action-btn delete"
                  onClick={() => deleteAlert(alert.id)}
                  title="Delete alert"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-alerts">
            <p>No alerts found</p>
          </div>
        )}
      </div>
    </div>
  );
};
