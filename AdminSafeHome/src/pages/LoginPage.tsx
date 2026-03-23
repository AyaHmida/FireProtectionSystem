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
  background: 'linear-gradient(135deg, #E24B4A, #a32d2d)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20
          }}>
            <img
    src="/fireguard-icon.svg"
    alt="FireGuard"
    style={{ width: 28, height: 28 }}
  />
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
          
         <button
  type="submit"
  className="btn btn-lg"
  style={{
    width: '100%',
    background: isLoading || success
      ? '#a32d2d'
      : 'linear-gradient(135deg, #E24B4A, #a32d2d)',
    color: '#fff',
    border: 'none',
    fontWeight: 500,
    letterSpacing: '0.5px',
    transition: 'opacity 0.2s, transform 0.1s',
    opacity: isLoading || success ? 0.8 : 1,
    cursor: isLoading || success ? 'not-allowed' : 'pointer',
  }}
  onMouseEnter={e => {
    if (!isLoading && !success)
      (e.currentTarget as HTMLButtonElement).style.opacity = '0.88';
  }}
  onMouseLeave={e => {
    (e.currentTarget as HTMLButtonElement).style.opacity = '1';
  }}
  disabled={isLoading || success}
>
  {isLoading ? ' Logging in...' : success ? 'Login Successful' : ' Admin Login'}
</button>
        </form>

        
      </div>
    </div>
  );
};
