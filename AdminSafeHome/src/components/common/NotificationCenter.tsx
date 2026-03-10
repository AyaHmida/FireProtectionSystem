import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BootstrapIcon } from '../../utils/bootstrapIcons';
import './notificationCenter.css';

interface INotificationCenter {}

export const NotificationCenter: React.FC<INotificationCenter> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Mock alerts data
  const alerts = [
    { id: 1, message: 'Motion detected in living room', time: '5 mins ago', type: 'alert' },
    { id: 2, message: 'Door sensor battery low', time: '2 hours ago', type: 'warning' },
    { id: 3, message: 'Temperature sensor offline', time: '1 day ago', type: 'error' },
  ];

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/alerts');
  };

  return (
    <div className="notification-center">
      <button 
        className="notification-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <BootstrapIcon name="bell-fill" size={18} color="#666" />
        <span className="notification-badge">{alerts.length}</span>
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Alerts</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="notification-list">
            {alerts.map(alert => (
              <div key={alert.id} className={`notification-item ${alert.type}`}>
                <div className="notification-icon">
                  <BootstrapIcon name="alert" size={14} />
                </div>
                <div className="notification-content">
                  <p className="notification-message">{alert.message}</p>
                  <span className="notification-time">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="view-all-btn" onClick={handleViewAll}>
            View All Alerts
          </button>
        </div>
      )}
    </div>
  );
};
