import { useNavigate } from 'react-router-dom'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '3em', marginBottom: '20px', color: 'var(--accent2)' }}>404</h1>
      <h2 style={{ fontSize: '1.8em', marginBottom: '20px' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.1em', marginBottom: '30px', color: 'var(--text2)' }}>
        Sorry, the page you are looking for does not exist.
      </p>
      <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
        <ArrowBackOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Back to Dashboard
      </button>
    </div>
  )
}

export default NotFound
