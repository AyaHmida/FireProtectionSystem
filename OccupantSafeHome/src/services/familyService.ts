const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7182/api'

export interface InviteFamilyMemberDto {
  email: string
}

export interface AcceptInvitationDto {
  token: string
  firstName: string
  lastName: string
  phoneNumber?: string
  passwordHash: string
}

export interface FamilyMemberDto {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  isActive: boolean
  createdAt: string
}

export interface PendingInvitationDto {
  id: number
  email: string
  expiresAt: string
  createdAt: string
}

export interface FamilyListResponseDto {
  activeMembers: FamilyMemberDto[]
  pendingInvitations: PendingInvitationDto[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper interne : fetch avec JWT pour les routes protégées
// On bypass apiClient complètement pour éviter le bug data.data!
// ─────────────────────────────────────────────────────────────────────────────
async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('authToken')

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    const message = (json as { message?: string })?.message ?? response.statusText
    throw new Error(message)
  }

  return json as T
}

class FamilyService {
  /**
   * Récupère membres actifs + invitations en attente
   * Route protégée (JWT)
   */
  async getFamilyMembers(): Promise<FamilyListResponseDto> {
    return authFetch<FamilyListResponseDto>('/family/members')
  }

  /**
   * Invite un nouveau membre par email
   * Route protégée (JWT)
   */
  async inviteMember(dto: InviteFamilyMemberDto): Promise<{ message: string }> {
    return authFetch<{ message: string }>('/family/invite', {
      method: 'POST',
      body: JSON.stringify({ email: dto.email }),
    })
  }

  /**
   * Révoque un membre actif OU annule une invitation en attente
   * Route protégée (JWT)
   */
  async revokeMember(memberId: number): Promise<{ message: string }> {
    return authFetch<{ message: string }>(`/family/members/${memberId}`, {
      method: 'DELETE',
    })
  }

  /**
   * Valide le token du lien d'invitation
   * Route PUBLIQUE (pas de JWT)
   */
  async validateInvitationToken(
    token: string
  ): Promise<{ valid: boolean; email: string }> {
    const response = await fetch(
      `${API_BASE_URL}/family/validate-token?token=${encodeURIComponent(token)}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    )
    const json = await response.json().catch(() => null)
    if (!response.ok) {
      throw new Error(
        (json as { message?: string })?.message ?? 'Lien invalide ou expiré.'
      )
    }
    return json
  }

  /**
   * Finalise la création du compte après clic sur le lien
   * Route PUBLIQUE (pas de JWT)
   */
  async acceptInvitation(dto: AcceptInvitationDto): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/family/accept-invitation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: dto.token,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phoneNumber: dto.phoneNumber ?? '',
        passwordHash: dto.passwordHash,
      }),
    })
    const json = await response.json().catch(() => null)
    if (!response.ok) {
      throw new Error(
        (json as { message?: string })?.message ?? 'Erreur lors de la création du compte.'
      )
    }
    return json
  }
}

export default new FamilyService()