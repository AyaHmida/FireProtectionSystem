import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services'
import familyService, {
  FamilyMemberDto,
  PendingInvitationDto,
} from '../services/familyService'

function Family() {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [activeMembers, setActiveMembers] = useState<FamilyMemberDto[]>([])
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState('')

  // Vérifier le rôle à la connexion
  useEffect(() => {
    const user = authService.getAuthUser()
    if (user?.role) {
      setUserRole(user.role)
      // Si ce n'est pas un Occupant, afficher un message
      if (user.role !== 'Occupant') {
        setLoading(false)
        return
      }
    }
    loadFamilyMembers()
  }, [])

  const loadFamilyMembers = async () => {
    try {
      setLoading(true)
      setError('')
      const result = await familyService.getFamilyMembers()
      console.log('🏠 Family data loaded:', result)
      setActiveMembers(result.activeMembers || [])
      setPendingInvitations(result.pendingInvitations || [])
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur de chargement'
      console.error('Error loading family:', errorMsg)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteError('')
    setInviteSuccess('')
    setInviteLoading(true)

    if (!inviteEmail.trim()) {
      setInviteError('Veuillez entrer une adresse email.')
      setInviteLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inviteEmail)) {
      setInviteError('Veuillez entrer une adresse email valide.')
      setInviteLoading(false)
      return
    }

    try {
      const result = await familyService.inviteMember({ email: inviteEmail })
      // ✅ Afficher le message de succès retourné par le backend
      setInviteSuccess(result.message)
      setInviteEmail('')
      setTimeout(() => {
        loadFamilyMembers()
        setShowInviteModal(false)
        setInviteSuccess('')
      }, 2000)
    } catch (err) {
      // ✅ Afficher le message d'erreur retourné par le backend
      // ex: "Un compte actif existe déjà avec cet email."
      //     "Une invitation est déjà en attente pour cet email."
      setInviteError(err instanceof Error ? err.message : "Erreur lors de l'envoi")
    } finally {
      setInviteLoading(false)
    }
  }

  const handleRevokeMember = async (memberId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir révoquer l'accès à ce membre ?")) return

    try {
      const result = await familyService.revokeMember(memberId)
      // ✅ Optionnel : afficher le message de succès du backend
      console.info(result.message)
      await loadFamilyMembers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la révocation')
    }
  }

  const handleCancelInvitation = async (invitationId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette invitation ?")) return

    try {
      const result = await familyService.revokeMember(invitationId)
      console.info(result.message)
      await loadFamilyMembers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'annulation")
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 20, marginBottom: 20 }}>⏳ Chargement...</div>
        <div style={{ color: 'var(--text2)' }}>Veuillez patienter...</div>
      </div>
    )
  }

  // Vérifier les permissions - seuls les Occupants peuvent gérer la famille
  if (userRole !== 'Occupant') {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">Gestion Familiale</div>
          <div className="page-desc">Gérez l'accès au système pour les membres de votre famille</div>
        </div>

        <div className="card section-gap">
          <div
            style={{
              background: 'rgba(239, 68, 68, .1)',
              border: '1px solid rgba(239, 68, 68, .3)',
              borderRadius: '8px',
              padding: '30px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 20 }}>🔒</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#ef4444' }}>
              Accès Refusé
            </div>
            <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20, maxWidth: '500px', margin: '0 auto 20px' }}>
              Seul le propriétaire du système (Occupant) peut gérer les membres de la famille.<br />
              Vous êtes actuellement connecté en tant que <strong>{userRole}</strong>.
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Retourner au Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Gestion Familiale</div>
        <div className="page-desc">Gérez l'accès au système pour les membres de votre famille</div>
      </div>

      {/* Message d'erreur global */}
      {error && (
        <div
          className="card section-gap"
          style={{
            background: 'rgba(239, 68, 68, .1)',
            border: '1px solid rgba(239, 68, 68, .3)',
            borderRadius: '8px',
            padding: '12px',
          }}
        >
          <div style={{ color: '#ef4444', fontSize: '14px' }}>⚠️ {error}</div>
        </div>
      )}

      {/* Membres actifs */}
      <div className="card section-gap">
        <div className="card-header">
          <span className="card-title">
            👥 Membres Actifs ({activeMembers.length})
          </span>
          <button
            className="btn btn-primary btn-small"
            onClick={() => {
              setInviteEmail('')
              setInviteError('')
              setInviteSuccess('')
              setShowInviteModal(true)
            }}
          >
            ➕ Inviter
          </button>
        </div>

        {activeMembers.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text2)' }}>
            <div style={{ fontSize: 13 }}>Aucun membre pour le moment.</div>
          </div>
        ) : (
          activeMembers.map(member => (
            <div
              key={member.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '16px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                👤
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>
                    {member.firstName} {member.lastName}
                  </span>
                  <span className="badge badge-green">Actif</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>
                  {member.email}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', display: 'flex', gap: 12 }}>
                  <span>📱 {member.phoneNumber || 'N/A'}</span>
                  <span>📅 Depuis le {formatDate(member.createdAt)}</span>
                </div>
              </div>
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleRevokeMember(member.id)}
              >
                ⛔ Révoquer
              </button>
            </div>
          ))
        )}
      </div>

      {/* Invitations en attente */}
      <div className="card section-gap">
        <div className="card-header">
          <span className="card-title">
            ⏳ Invitations en Attente ({pendingInvitations?.length || 0})
          </span>
        </div>

        {!pendingInvitations || pendingInvitations.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text2)' }}>
            <div style={{ fontSize: 13 }}>Aucune invitation en attente.</div>
          </div>
        ) : (
          pendingInvitations.map(invitation => (
            <div
              key={invitation.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '16px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: 'rgba(245, 158, 11, .1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                📧
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{invitation.email}</span>
                  <span className="badge badge-warn">En attente</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', display: 'flex', gap: 12 }}>
                  <span>📅 Créé le {formatDate(invitation.createdAt)}</span>
                  <span>⏰ Expire le {formatDate(invitation.expiresAt)}</span>
                </div>
              </div>
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleCancelInvitation(invitation.id)}
              >
                ❌ Annuler
              </button>
            </div>
          ))
        )}
      </div>

      {/* Niveaux d'accès */}
      <div className="card section-gap">
        <div className="card-header">
          <span className="card-title">📋 Niveaux d'Accès</span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
            padding: '16px',
          }}
        >
          {[
            {
              icon: '👑',
              title: 'Propriétaire',
              color: '0, 200, 150',
              items: [
                '✓ Contrôle total du système',
                '✓ Gestion des membres',
                '✓ Configuration complète',
                '✓ Historique des alertes',
              ],
            },
            {
              icon: '👥',
              title: 'Membre',
              color: '96, 165, 250',
              items: [
                '✓ Consultation du statut',
                '✓ Réception des alertes',
                '✓ Contrôle du système',
                '✗ Configuration restreinte',
              ],
            },
            {
              icon: '👀',
              title: 'Observateur',
              color: '245, 158, 11',
              items: [
                '✓ Consultation du statut',
                '✓ Historique des alertes',
                '✗ Aucun contrôle',
                '✗ Configuration interdite',
              ],
            },
          ].map(({ icon, title, color, items }) => (
            <div
              key={title}
              style={{
                background: `rgba(${color}, .08)`,
                border: `1px solid rgba(${color}, .2)`,
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
                {icon} {title}
              </div>
              <ul style={{ fontSize: 11, color: 'var(--text2)', lineHeight: '1.6', margin: 0, paddingLeft: 16 }}>
                {items.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Modal d'invitation */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">➕ Inviter un Membre</div>
            <div className="modal-sub">
              Envoyez une invitation à quelqu'un pour rejoindre votre famille
            </div>

            {inviteError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, .1)',
                  border: '1px solid rgba(239, 68, 68, .3)',
                  borderRadius: '6px',
                  padding: '10px',
                  marginBottom: '12px',
                  fontSize: '12px',
                  color: '#ef4444',
                }}
              >
                ⚠️ {inviteError}
              </div>
            )}

            {inviteSuccess && (
              <div
                style={{
                  background: 'rgba(34, 197, 94, .1)',
                  border: '1px solid rgba(34, 197, 94, .3)',
                  borderRadius: '6px',
                  padding: '10px',
                  marginBottom: '12px',
                  fontSize: '12px',
                  color: '#22c55e',
                }}
              >
                ✅ {inviteSuccess}
              </div>
            )}

            <form onSubmit={handleInviteMember}>
              <div className="form-group">
                <label className="form-label">📧 Adresse email *</label>
                <input
                  placeholder="exemple@email.com"
                  type="email"
                  className="form-input"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  disabled={inviteLoading}
                  required
                />
              </div>

              <div
                style={{
                  background: 'rgba(96, 165, 250, .08)',
                  border: '1px solid rgba(96, 165, 250, .2)',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 16,
                  fontSize: 11,
                  color: 'var(--text2)',
                  lineHeight: '1.5',
                }}
              >
                ℹ️ Un email sera envoyé avec un lien d'acceptation valable <strong>48 heures</strong>.
                Le membre créera son compte directement via ce lien.
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowInviteModal(false)}
                  disabled={inviteLoading}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={inviteLoading}>
                  {inviteLoading ? '⏳ Envoi...' : "📧 Envoyer l'invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Family
