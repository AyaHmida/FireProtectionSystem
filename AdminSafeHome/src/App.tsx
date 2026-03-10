import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ZonesPage } from './pages/ZonesPage';
import { SensorsPage } from './pages/SensorsPage';
import { UsersPage } from './pages/UsersPage';
import { LogsPage } from './pages/LogsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { AlertesPage } from './pages/AlertesPage';
import { ProfilePage } from './pages/ProfilePage';
import { Sidebar } from './components/layout/Sidebar';
import { NotificationCenter } from './components/common/NotificationCenter';
import { UserMenu } from './components/common/UserMenu';
import './globals.css';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <div>
            <div className="page-breadcrumb">SafeHome <span>/ Admin / {getPageLabel(location.pathname)}</span></div>
          </div>
          <div className="topbar-right">
            <div className="sys-status"><div className="sys-dot"/>System Nominal</div>
            <NotificationCenter />
            <UserMenu />
          </div>
        </div>
        <div className="page">{children}</div>
      </div>
    </div>
  );
};

const getPageLabel = (pathname: string) => {
  const labels: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/zones': 'Zones',
    '/sensors': 'Sensors',
    '/users': 'Users',
    '/logs': 'System Logs',
    '/maintenance': 'Maintenance & Statistics',
    '/alerts': 'Alerts',
    '/profile': 'My Profile',
  };
  return labels[pathname] || 'Dashboard';
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/zones"
              element={
                <ProtectedRoute>
                  <ZonesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sensors"
              element={
                <ProtectedRoute>
                  <SensorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logs"
              element={
                <ProtectedRoute>
                  <LogsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maintenance"
              element={
                <ProtectedRoute>
                  <MaintenancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <AlertesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  );
};

export default App;
