import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import familyService from '../services/familyService'

function AcceptInvitation() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token')
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [validating, setValidating] = useState(true)

  // Formulaire
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Valider le token au chargement
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Token manquant. Lien invalide.')
        setValidating(false)
        return
      }

      try {
        const result = await familyService.validateInvitationToken(token)
        if (result.valid) {
          setEmail(result.email)
          setError('')
        } else {
          setError('Lien invalide ou expiré. Demandez une nouvelle invitation.')
        }
      } catch (err) {
        setError('Erreur lors de la validation du lien.')
        console.error(err)
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validations simples
    if (!firstName.trim() || !lastName.trim()) {
      setError('Le prénom et le nom sont requis.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      setLoading(false)
      return
    }

    if (!token) {
      setError('Token manquant.')
      setLoading(false)
      return
    }

    try {
      await familyService.acceptInvitation({
        token,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        passwordHash: password,
      })

      // Succès
      setError('')
      navigate(
        '/login?message=' +
          encodeURIComponent(
            'Invitation acceptée ! Connectez-vous avec votre email.'
          )
      )
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
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
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🔄</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
              Vérification du lien...
            </div>
            <div style={{ color: 'var(--text2)', fontSize: 14 }}>Veuillez patienter...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!email || error === 'Lien invalide ou expiré. Demandez une nouvelle invitation.') {
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
        <div className="modal" style={{ maxWidth: 450 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div className="logo-icon">🔥</div>
            <div>
              <div className="logo-text">SafeHome</div>
              <div className="logo-sub">Lien invalide</div>
            </div>
          </div>

          <div className="modal-title">❌ Invitation Invalide</div>
          <div className="modal-sub">Le lien d'accès a expiré ou est invalide.</div>

          <div
            style={{
              background: 'rgba(239, 68, 68, .1)',
              border: '1px solid rgba(239, 68, 68, .3)',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#ef4444',
              textAlign: 'center',
            }}
          >
            {error || 'Le lien d\'invitation est invalide ou a expiré.'}
          </div>

          <div className="modal-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/login')}
              style={{ width: '100%' }}
            >
              Retourner à la connexion
            </button>
          </div>
        </div>
      </div>
    )
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
      <div className="modal" style={{ maxWidth: 500 }}>
        {/* Logo Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div className="logo-icon">🔥</div>
          <div>
            <div className="logo-text">SafeHome</div>
            <div className="logo-sub">Invitation d'accès</div>
          </div>
        </div>

        <div className="modal-title">👋 Création de Compte</div>
        <div className="modal-sub">Complétez votre profil pour accéder au système</div>

        {/* Email (lecture seule) */}
        <div className="form-group">
          <label className="form-label">📧 Email</label>
          <div
            style={{
              padding: '10px 12px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            {email}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Message d'erreur */}
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, .1)',
                border: '1px solid rgba(239, 68, 68, .3)',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px',
                fontSize: '13px',
                color: '#ef4444',
              }}
            >
              {error}
            </div>
          )}

          {/* Grille 2 colonnes pour Prénom et Nom */}
          <div className="grid-2">
            {/* Prénom */}
            <div className="form-group">
              <label className="form-label">Prénom *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Jean"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Nom */}
            <div className="form-group">
              <label className="form-label">Nom *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Martin"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Téléphone */}
          <div className="form-group">
            <label className="form-label">Téléphone (optionnel)</label>
            <input
              type="tel"
              className="form-input"
              placeholder="+33 6 12 34 56 78"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Mot de passe */}
          <div className="form-group">
            <label className="form-label">Mot de passe *</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
              Minimum 6 caractères
            </div>
          </div>

          {/* Confirmation mot de passe */}
          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe *</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Message d'info */}
          <div
            style={{
              background: 'rgba(96, 165, 250, .08)',
              border: '1px solid rgba(96, 165, 250, .2)',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '12px',
              color: 'var(--text2)',
            }}
          >
            ℹ️ Après validation, votre compte sera activé automatiquement. Vous pourrez accéder
            à tous les systèmes.
          </div>

          {/* Boutons */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              Canceller
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '⏳ Création...' : '✅ Créer mon compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AcceptInvitation
