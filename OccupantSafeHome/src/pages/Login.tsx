import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthService from '../services/authService'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setErrors({})
    setLoading(true)

    // Validation basique
    if (!email.trim()) {
      setErrors({ Email: ['Email is required'] })
      setLoading(false)
      return
    }
    if (!password.trim()) {
      setErrors({ Password: ['Password is required'] })
      setLoading(false)
      return
    }

    try {
      const response = await AuthService.login({ email, password })
      if (response) {
        navigate('/dashboard')
      }
    } catch (err: any) {
      // Afficher le message d'erreur du backend
      if (err.message) {
        setErrors({ general: [err.message] })
      } else {
        setErrors({ general: ['An error occurred during login'] })
      }
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin()
    }
  }

  const getFieldError = (fieldName: string): string | null => {
    return errors[fieldName] ? errors[fieldName][0] : null
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--bg)',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/assets/images/fire.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="modal" style={{ maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div className="logo-icon">🔥</div>
          <div>
            <div className="logo-text">SafeHome</div>
            <div className="logo-sub">Fire Safety System</div>
          </div>
        </div>
        <div className="modal-title">Login</div>
        <div className="modal-sub">Access your supervision dashboard</div>

        {errors.general && (
          <p style={{ 
            color: '#c33', 
            fontSize: 13, 
            textAlign: 'center',
            marginTop: 0,
            marginBottom: '16px'
          }}>
            {errors.general[0]}
          </p>
        )}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            style={{
              borderColor: getFieldError('Email') ? '#c33' : undefined
            }}
          />
          {getFieldError('Email') && (
            <p style={{ color: '#c33', fontSize: 12, marginTop: 4, margin: 0 }}>
              {getFieldError('Email')}
            </p>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            style={{
              borderColor: getFieldError('Password') ? '#c33' : undefined
            }}
          />
          {getFieldError('Password') && (
            <p style={{ color: '#c33', fontSize: 12, marginTop: 4, margin: 0 }}>
              {getFieldError('Password')}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right', marginBottom: 16 }}>
          <span
            style={{
              color: 'var(--accent2)',
              cursor: loading ? 'not-allowed' : 'pointer',
              textDecoration: 'underline',
              fontSize: 13,
              opacity: loading ? 0.6 : 1
            }}
            onClick={() => !loading && navigate('/reset-password')}
          >
            Forgot password?
          </span>
        </div>
        <button
          className="btn btn-primary btn-lg"
          style={{ width: '100%' }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 12, margin: '16px 0', position: 'relative' }}>
          <span>or</span>
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text2)' }}>
          Don't have an account? <span
            style={{
              color: 'var(--accent2)',
              cursor: loading ? 'not-allowed' : 'pointer',
              textDecoration: 'underline',
              opacity: loading ? 0.6 : 1
            }}
            onClick={() => !loading && navigate('/register')}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login

