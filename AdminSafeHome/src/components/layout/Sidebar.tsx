import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import EdgesensorHighOutlinedIcon from '@mui/icons-material/EdgesensorHighOutlined';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ContactsRoundedIcon from '@mui/icons-material/ContactsRounded';
import RouterOutlinedIcon from '@mui/icons-material/RouterOutlined';

interface NavItem {
  id: string;
  icon: React.ComponentType<{ sx?: any }>;
  label: string;
  chip?: string;
  chipType?: string;
  color?: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const nav: NavSection[] = [
    {
      section: 'Supervision',
      items: [
        { id: 'dashboard', icon: AutoGraphOutlinedIcon, label: 'Dashboard', color: '#3b82f6' },
        { id: 'alerts', icon: NotificationsOutlinedIcon, label: 'Alerts', chip: '2', chipType: 'red', color: '#ef4444' },
      ],
    },
    {
      section: 'Infrastructure',
      items: [
        { id: 'zones', icon: MapOutlinedIcon, label: 'Zones', color: '#06b6d4' },
            { id: 'devices', icon: RouterOutlinedIcon,          label: 'Devices', color: '#8b5cf6' }, // ← AJOUTÉ

        { id: 'sensors', icon: EdgesensorHighOutlinedIcon, label: 'Sensors', chip: '2', chipType: 'yellow', color: '#f59e0b' },
      ],
    },
    {
      section: 'Users',
      items: [
        { id: 'users', icon: PeopleAltTwoToneIcon, label: 'Users', chip: '1', chipType: 'blue', color: '#8b5cf6' },
      ],
    },
    {
      section: 'System',
      items: [
        { id: 'logs', icon: AssignmentOutlinedIcon, label: 'System Logs', chip: '2', chipType: 'red', color: '#06b6d4' },
        { id: 'maintenance', icon: PrecisionManufacturingOutlinedIcon, label: 'Maintenance & Stats', color: '#10b981' },
      ],
    },
    {
      section: 'Profile',
      items: [
        { id: 'Profile', icon: ContactsRoundedIcon, label: 'Profile', chip: '2', chipType: 'red', color: '#4555cf' },
      ],
    },
  ];

  return (
    <div
      className="sidebar"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-badge">
          <ShieldOutlinedIcon sx={{ fontSize: 24, color: '#ffffff' }} />
        </div>
        <div>
          <div className="logo-title">SafeHome</div>
          <div className="logo-sub">Admin Panel</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="nav-wrap" style={{ flex: 1 }}>
        {nav.map((group) => (
          <div key={group.section}>
            <div className="nav-group-label">{group.section}</div>

            {group.items.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.id}
                  to={`/${item.id}`}
                  className={`nav-link ${
                    location.pathname === `/${item.id}` ? 'active' : ''
                  }`}
                >
                  <IconComponent
                    sx={{
                      fontSize: 20,
                      color: item.color || '#666',
                      transition: 'all 0.25s ease',
                    }}
                  />

                  <span>{item.label}</span>

                  {item.chip && (
                    <span className={`nav-chip ${item.chipType}`}>
                      {item.chip}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="admin-card">
          <div className="admin-av">
            {user?.firstName?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <div className="admin-name">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</div>
            <div className="admin-role">{user?.role?.toUpperCase() || 'USER'}</div>
          </div>
        </div>

       <button className="logout-btn" onClick={logout} > <LogoutOutlinedIcon sx={{ fontSize: 18, color: '#666' }} /> Logout </button>
      </div>
    </div>
  );
};
