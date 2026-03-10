import React from 'react';
import BellIcon from '@mui/icons-material/NotificationsOutlined';
import GearIcon from '@mui/icons-material/SettingsOutlined';
import UserIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import AlertIcon from '@mui/icons-material/NotificationsActive';

interface BootstrapIconProps {
  name: string;
  size?: number;
  color?: string;
}

export const BootstrapIcon: React.FC<BootstrapIconProps> = ({ name, size = 20, color = 'currentColor' }) => {
  const sx = { fontSize: size, color };

  switch (name) {
    case 'bell':
    case 'bell-fill':
      return <BellIcon sx={sx} />;
    case 'gear':
    case 'gear-fill':
      return <GearIcon sx={sx} />;
    case 'person':
    case 'person-fill':
      return <UserIcon sx={sx} />;
    case 'logout':
      return <LogoutIcon sx={sx} />;
    case 'alert':
      return <AlertIcon sx={sx} />;
    default:
      return <GearIcon sx={sx} />;
  }
};
