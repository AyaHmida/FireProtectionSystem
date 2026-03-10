import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { RegisterRequestDto } from '../dto/RegisterRequestDto'
import AuthService from '../services/authService'

function Register() {
  const [lastName, setLastName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    setErrors({})

    // Client-side validation
    const newErrors: { [key: string]: string[] } = {}

    if (!lastName.trim()) {
      newErrors.LastName = ['Last name is required.']
    } else if (lastName.trim().length > 100) {
      newErrors.LastName = ['Last name must not exceed 100 characters.']
    }

    if (!firstName.trim()) {
      newErrors.FirstName = ['First name is required.']
    } else if (firstName.trim().length > 100) {
      newErrors.FirstName = ['First name must not exceed 100 characters.']
    }

    if (!email.trim()) {
      newErrors.Email = ['Email is required.']
    } 

    if (!phoneNumber.trim()) {
      newErrors.PhoneNumber = ['Phone number is required.']
    } else if (!/^\d+$/.test(phoneNumber.replace(/\s|-/g, ''))) {
      newErrors.PhoneNumber = ['Phone number must contain only digits.']
    } else if (phoneNumber.replace(/\s|-/g, '').length < 8) {
      newErrors.PhoneNumber = ['Phone number must be at least 8 digits.']
    } else if (phoneNumber.length > 20) {
      newErrors.PhoneNumber = ['Phone number must not exceed 20 characters.']
    }

    if (!password.trim()) {
      newErrors.Password = ['Password is required.']
    } else if (password.length < 8) {
      newErrors.Password = ['Password must be at least 8 characters.']
    } else if (!/(?=.*[a-z])/.test(password)) {
      newErrors.Password = ['Password must contain lowercase letter.']
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.Password = ['Password must contain uppercase letter.']
    } else if (!/(?=.*\d)/.test(password)) {
      newErrors.Password = ['Password must contain number.']
    } else if (!/(?=.*[@$!%*?&])/.test(password)) {
      newErrors.Password = ['Password must contain special character (@$!%*?&).']
    }

    if (!confirmPassword.trim()) {
      newErrors.ConfirmPassword = ['Please confirm your password.']
    } else if (password !== confirmPassword) {
      newErrors.ConfirmPassword = ['Passwords do not match.']
    }

    // If client validation fails, show errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    const request: RegisterRequestDto = {
      lastName,
      firstName,
      email,
      phoneNumber,
      password,
      confirmPassword
    }

    try {
      const response = await AuthService.register(request as any)
      console.log("User created:", response)

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login")
      }, 1000)
    } catch (err: any) {
      // Display all backend validation errors
      if (err.errors && typeof err.errors === 'object') {
        setErrors(err.errors)
      } else if (err.message) {
        // Check if it's an email already exists error
        if (err.message.toLowerCase().includes('email') && err.message.toLowerCase().includes('already')) {
          setErrors({ Email: [err.message] })
        } else if (err.message.toLowerCase().includes('email')) {
          setErrors({ Email: [err.message] })
        } else {
          // Show server error as a general error
          setErrors({ general: [err.message] })
        }
      } else {
        setErrors({ general: ['An unexpected error occurred.'] })
      }
      console.error("Registration error:", err)
    } finally {
      setLoading(false)
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
      <div className="modal">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div className="logo-icon">🔥</div>
          <div>
            <div className="logo-text">SafeHome</div>
            <div className="logo-sub">Create an account</div>
          </div>
        </div>
        <div className="modal-title">Create an account</div>
        <div className="modal-sub">Join SafeHome and secure your home</div>

        {errors.general && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '13px',
            border: '1px solid #fcc'
          }}>
            {errors.general[0]}
          </div>
        )}

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              className="form-input"
              placeholder="Ben Salah"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              disabled={loading}
              style={{
                borderColor: getFieldError('LastName') ? '#c33' : undefined
              }}
            />
            {getFieldError('LastName') && (
              <p style={{ color: '#c33', fontSize: 12, marginTop: 4, margin: 0 }}>
                {getFieldError('LastName')}
              </p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              className="form-input"
              placeholder="Ahmed"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              disabled={loading}
              style={{
                borderColor: getFieldError('FirstName') ? '#c33' : undefined
              }}
            />
            {getFieldError('FirstName') && (
              <p style={{ color: '#c33', fontSize: 12, marginTop: 4, margin: 0 }}>
                {getFieldError('FirstName')}
              </p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
          <label className="form-label">Phone</label>
          <input
            className="form-input"
            placeholder="+216 XX XXX XXX"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            disabled={loading}
            style={{
              borderColor: getFieldError('PhoneNumber') ? '#c33' : undefined
            }}
          />
          {getFieldError('PhoneNumber') && (
            <p style={{ color: '#c33', fontSize: 12, marginTop: 4, margin: 0 }}>
              {getFieldError('PhoneNumber')}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Min. 8 characters (uppercase, lowercase, number, special)"
            value={password}
            onChange={e => setPassword(e.target.value)}
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

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={loading}
            style={{
              borderColor: getFieldError('ConfirmPassword') ? '#c33' : undefined
            }}
          />
          {getFieldError('ConfirmPassword') && (
            <p style={{ color: '#c33', fontSize: 12, marginTop: 4, margin: 0 }}>
              {getFieldError('ConfirmPassword')}
            </p>
          )}
        </div>

        <button
          className="btn btn-primary btn-lg"
          disabled={loading}
          style={{ width: '100%', marginTop: 16 }}
          onClick={handleRegister}
        >
          {loading ? "Creating..." : "Create my account"}
        </button>

        <p style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--text2)' }}>
          Already have an account?{" "}
          <span
            style={{
              color: 'var(--accent2)',
              cursor: loading ? 'not-allowed' : 'pointer',
              textDecoration: 'underline',
              opacity: loading ? 0.6 : 1
            }}
            onClick={() => !loading && navigate('/login')}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register
