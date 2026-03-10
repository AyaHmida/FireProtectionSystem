import { useNavigate } from 'react-router-dom'

function ResetPassword() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(0,200,150,.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,136,255,.06) 0%, transparent 60%)' }}>
      <div className="modal" style={{ maxWidth: 380 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div className="logo-icon">🔑</div>
          <div>
            <div className="logo-text">SafeHome</div>
            <div className="logo-sub">Réinitialisation</div>
          </div>
        </div>
        <div className="modal-title">Mot de passe oublié</div>
        <div className="modal-sub">Entrez votre email pour recevoir un lien de réinitialisation</div>
        <div className="form-group">
          <label className="form-label">Adresse Email</label>
          <input className="form-input" type="email" placeholder="votre@email.com" />
        </div>
        <button className="btn btn-primary btn-lg" style={{ width: '100%' }}>
          📧 Envoyer le lien
        </button>
        <p style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--text2)' }}>
          <span style={{ color: 'var(--accent2)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/login')}>
            ← Retour à la connexion
          </span>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword
