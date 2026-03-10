import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BootstrapIcon } from '../../utils/bootstrapIcons';
import './userMenu.css';

interface IUserMenu {}

export const UserMenu: React.FC<IUserMenu> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User';

  return (
    <div className="user-menu">
      <button 
        className="user-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={fullName}
      >
        <BootstrapIcon name="person-fill" size={18} color="#666" />
      </button>

      {isOpen && (
        <div className="user-dropdown">
          <div className="user-info">
            <div className="user-avatar">
              <BootstrapIcon name="person-fill" size={24} color="#fff" />
            </div>
            <div className="user-details">
              <p className="user-name">{fullName}</p>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>

          <div className="user-menu-divider"></div>

          <button className="menu-item" onClick={handleProfile}>
            <BootstrapIcon name="person" size={16} />
            <span>My Profile</span>
          </button>

          <div className="user-menu-divider"></div>

          <button className="menu-item logout" onClick={handleLogout}>
            <BootstrapIcon name="logout" size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};
