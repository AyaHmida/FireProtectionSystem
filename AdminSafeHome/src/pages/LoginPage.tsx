import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('admin@safehome.tn');
  const [password, setPassword] = useState('password123');
  const [clientValidationError, setClientValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setSuccess(true);
      const timer = setTimeout(() => navigate('/dashboard'), 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientValidationError(null);

    if (!email || !password) {
      setClientValidationError('Email and password are required');
      return;
    }

    await login(email, password);
  };

  const displayError = clientValidationError || error;

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-admin-badge"> ADMIN ONLY — /admin</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20
          }}>
            🛡️
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>SafeHome Admin</div>
            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--accent)', letterSpacing: 1 }}>
              ADMINISTRATION PANEL
            </div>
          </div>
        </div>
        <div className="auth-title">Administrator Access</div>
        <div className="auth-sub">Reserved interface for system administrators</div>

        {/* Success Message */}
        {success && (
          <div style={{
            padding: '12px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 8,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#10b981'
          }}>
            <CheckCircleIcon sx={{ fontSize: 20 }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>
              Login successful! Redirecting...
            </span>
          </div>
        )}

        {/* Error Message */}
        {displayError && (
          <div style={{
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 8,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            color: '#ef4444'
          }}>
            <ErrorOutlineIcon sx={{ fontSize: 20, flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Login Error</div>
              <div style={{ fontSize: 12, marginTop: '4px', opacity: 0.9 }}>
                {displayError}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="fg">
            <label className="fl">Administrator Email</label>
            <input
              className="fi"
              type="email"
              placeholder="admin@safehome.tn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="fg">
            <label className="fl">Password</label>
            <input
              className="fi"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div style={{
            padding: '10px 12px',
            background: 'rgba(124,58,237,.08)',
            borderRadius: 8,
            fontSize: 11,
            fontFamily: 'var(--mono)',
            color: 'var(--text2)',
            marginBottom: 16
          }}>
            🔒 Access verified by "Admin" role on every request
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={isLoading || success}
          >
            {isLoading ? '⏳ Logging in...' : success ? '✓ Login Successful' : '🛡️ Admin Login'}
          </button>
        </form>

        
      </div>
    </div>
  );
};
