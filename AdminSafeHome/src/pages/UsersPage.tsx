import React, { useState, useEffect } from 'react';
import PauseOutlinedIcon       from '@mui/icons-material/PauseOutlined';
import PlayArrowOutlinedIcon   from '@mui/icons-material/PlayArrowOutlined';
import DeleteOutlinedIcon      from '@mui/icons-material/DeleteOutlined';
import PeopleOutlinedIcon      from '@mui/icons-material/PeopleOutlined';
import PersonOutlinedIcon      from '@mui/icons-material/PersonOutlined';
import userManagementService   from '../services/userManagementService';
import { UserAdminDto }        from '../types';

type ActionType = 'suspend' | 'activate' | 'validate' | 'delete' | 'family' | null;

export const UsersPage: React.FC = () => {
  const [users, setUsers]               = useState<UserAdminDto[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [tab, setTab]                   = useState<string>('all');

  // Modal action (suspend / delete / activate / validate)
  const [actionModal, setActionModal]   = useState<{ user: UserAdminDto; action: ActionType } | null>(null);
  const [reason, setReason]             = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [modalError, setModalError]     = useState<string | null>(null);

  // Modal family members
  const [familyMembers, setFamilyMembers]       = useState<UserAdminDto[]>([]);
  const [familyLoading, setFamilyLoading]       = useState(false);
  const [selectedOccupant, setSelectedOccupant] = useState<UserAdminDto | null>(null);

  // ── Filtre onglets ────────────────────────────────────────────
  const getFilteredUsers = () => {
    if (tab === 'active')    return users.filter(u => u.isActive && !u.isSuspended);
    if (tab === 'suspended') return users.filter(u => u.isSuspended);
    if (tab === 'pending')   return users.filter(u => !u.isActive && !u.isSuspended);
    return users; // all
  };
  const filtered = getFilteredUsers();

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userManagementService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // ── Action (suspend / delete / activate / validate) ──────────
  const handleAction = async () => {
    if (!actionModal) return;
    setModalError(null);
    try {
      setActionLoading(true);
      const { user, action } = actionModal;
      switch (action) {
        case 'suspend':
          if (!reason.trim()) { setModalError('Reason is required'); return; }
          await userManagementService.suspendUser(user.id, { reason });
          break;
        case 'delete':
          await userManagementService.deleteUser(user.id);
          break;
        case 'activate':
          await userManagementService.reactivateUser(user.id);
          break;
        case 'validate':
          await userManagementService.validateUser(user.id);
          break;
      }
      await loadUsers();
      closeActionModal();
    } catch (err: any) {
      const body = err?.body;
      if (body?.errors) {
        const parts: string[] = [];
        for (const [k, v] of Object.entries(body.errors))
          parts.push(`${k}: ${Array.isArray(v) ? v.join(' ') : String(v)}`);
        setModalError(parts.join(' '));
      } else {
        setModalError(err instanceof Error ? err.message : 'Action failed');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // ── Ouvrir modal family members ───────────────────────────────
  const openFamilyModal = async (occupant: UserAdminDto) => {
    setSelectedOccupant(occupant);
    setFamilyMembers([]);
    setFamilyLoading(true);
    try {
      const members = await userManagementService.getFamilyMembers(occupant.id);
      setFamilyMembers(members);
    } catch {
      setFamilyMembers([]);
    } finally {
      setFamilyLoading(false);
    }
  };

  const closeActionModal = () => {
    setActionModal(null);
    setReason('');
    setModalError(null);
  };

  const closeFamilyModal = () => {
    setSelectedOccupant(null);
    setFamilyMembers([]);
  };

  // ── Badge rôle ────────────────────────────────────────────────
  const roleBadge = (role: string) => {
    if (role === 'Occupant')
      return <span className="bd bd-purple">Occupant</span>;
    if (role === 'Admin')
      return <span className="bd bd-blue">Admin</span>;
    return <span className="bd bd-gray">{role}</span>;
  };

  // ── Badge statut ──────────────────────────────────────────────
  const statusBadge = (u: UserAdminDto) => {
    if (u.isSuspended) return <span className="bd bd-red">Suspended</span>;
    if (u.isActive)    return <span className="bd bd-green">Active</span>;
    return               <span className="bd bd-yellow">Pending</span>;
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div>
      {error && (
        <div style={{
          padding: '12px 16px', marginBottom: 16,
          background: 'var(--danger)20', border: '1px solid var(--danger)',
          borderRadius: 8, color: 'var(--danger)',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>{error}</span>
          <button onClick={() => setError(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: 20 }}>×</button>
        </div>
      )}

      <div className="page-hd">
        <div className="page-title">Users Management</div>
        <div className="page-desc">Account validation, suspension and deletion</div>
      </div>

      {/* ── Onglets ─────────────────────────────────────────── */}
      <div className="tabs">
        {[
          { key: 'all',       label: 'All' },
          { key: 'active',    label: 'Active' },
          { key: 'pending',   label: 'Pending' },
          { key: 'suspended', label: 'Suspended' },
        ].map(t => (
          <div key={t.key}
            className={`tab ${tab === t.key ? 'on' : ''}`}
            onClick={() => setTab(t.key)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>Loading users...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>No users found</div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registered</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  {/* User */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 13,
                      }}>
                        {u.firstName?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        {u.firstName} {u.lastName}
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)' }}>
                    {u.email}
                  </td>

                  {/* Role */}
                  <td>{roleBadge(u.role)}</td>

                  {/* Registered */}
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  {/* Status */}
                  <td>{statusBadge(u)}</td>

                  {/* Actions */}
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>

                      {/* Validate / Suspend / Activate */}
                      {u.isSuspended ? (
                        <button className="btn btn-sm btn-green"
                          onClick={() => setActionModal({ user: u, action: 'activate' })}
                          style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <PlayArrowOutlinedIcon sx={{ fontSize: 14 }} /> Activate
                        </button>
                      ) : !u.isActive ? (
                        <button className="btn btn-sm btn-green"
                          onClick={() => setActionModal({ user: u, action: 'validate' })}
                          style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          Validate
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-danger"
                          onClick={() => { setActionModal({ user: u, action: 'suspend' }); setReason(''); }}
                          style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <PauseOutlinedIcon sx={{ fontSize: 14 }} /> Suspend
                        </button>
                      )}

                      {/* Bouton Members — uniquement pour Occupant ← AJOUTÉ */}
                      {u.role === 'Occupant' && (
                        <button
                          onClick={() => openFamilyModal(u)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '4px 10px', borderRadius: 6, fontSize: 12,
                            fontWeight: 500, cursor: 'pointer',
                            background: '#8b5cf620', color: '#8b5cf6',
                            border: '1px solid #8b5cf6',
                          }}>
                          <PeopleOutlinedIcon sx={{ fontSize: 14 }} /> Members
                        </button>
                      )}

                      {/* Delete */}
                      <button className="btn btn-sm btn-danger"
                        onClick={() => { setActionModal({ user: u, action: 'delete' }); setReason(''); }}>
                        <DeleteOutlinedIcon sx={{ fontSize: 14 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          MODAL : Action (validate / suspend / activate / delete)
      ══════════════════════════════════════════════════════ */}
      {actionModal && actionModal.action !== 'family' && (
        <div className="overlay" onClick={closeActionModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {actionModal.action === 'suspend'  && <><PauseOutlinedIcon sx={{ fontSize: 20 }} /> Suspend Account</>}
              {actionModal.action === 'activate' && <><PlayArrowOutlinedIcon sx={{ fontSize: 20 }} /> Activate Account</>}
              {actionModal.action === 'validate' && <><PlayArrowOutlinedIcon sx={{ fontSize: 20 }} /> Validate Account</>}
              {actionModal.action === 'delete'   && <><DeleteOutlinedIcon sx={{ fontSize: 20 }} /> Delete Account</>}
            </div>

            <div className="modal-sub">
              User: <strong>{actionModal.user.firstName} {actionModal.user.lastName}</strong>
            </div>

            {modalError && (
              <div style={{ color: 'var(--danger)', marginBottom: 12, fontSize: 13 }}>
                {modalError}
              </div>
            )}

            {/* Champ raison — uniquement pour suspend */}
            {actionModal.action === 'suspend' && (
              <div className="fg">
                <label className="fl">Reason *</label>
                <input className="fi"
                  placeholder="Specify the reason for suspension..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  disabled={actionLoading} />
              </div>
            )}

            {/* Confirmation delete */}
            {actionModal.action === 'delete' && (
              <div style={{
                background: 'var(--danger)20', border: '1px solid var(--danger)',
                borderRadius: 8, padding: 12, marginBottom: 12,
                fontSize: 13, color: 'var(--danger)',
              }}>
                This action cannot be undone. The account will be soft deleted.
              </div>
            )}

            <div className="modal-foot">
              <button className="btn btn-secondary"
                onClick={closeActionModal} disabled={actionLoading}>
                Cancel
              </button>
              <button
                className={`btn ${
                  actionModal.action === 'activate' || actionModal.action === 'validate'
                    ? 'btn-green' : 'btn-danger'
                }`}
                onClick={handleAction}
                disabled={actionLoading}>
                {actionLoading ? 'Processing...'
                  : actionModal.action === 'suspend'  ? 'Confirm Suspension'
                  : actionModal.action === 'activate' ? 'Activate Account'
                  : actionModal.action === 'validate' ? 'Validate Account'
                  : 'Confirm Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL : Family Members d'un occupant ← AJOUTÉ
      ══════════════════════════════════════════════════════ */}
      {selectedOccupant && (
        <div className="overlay" onClick={closeFamilyModal}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ minWidth: 480 }}>
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <PeopleOutlinedIcon sx={{ fontSize: 20 }} />
              Family Members
            </div>
            <div className="modal-sub">
              Occupant: <strong>{selectedOccupant.firstName} {selectedOccupant.lastName}</strong>
            </div>

            {familyLoading ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text2)', fontSize: 13 }}>
                Loading members...
              </div>
            ) : familyMembers.length === 0 ? (
              <div style={{
                padding: '20px 0', textAlign: 'center',
                color: 'var(--text2)', fontSize: 13,
              }}>
                <PersonOutlinedIcon sx={{ fontSize: 36, color: 'var(--text3)', display: 'block', margin: '0 auto 8px' }} />
                No family members for this occupant.
              </div>
            ) : (
              <table className="tbl" style={{ marginTop: 8 }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {familyMembers.map(m => (
                    <tr key={m.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 6,
                            background: '#8b5cf620', color: '#8b5cf6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: 12,
                          }}>
                            {m.firstName?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>
                            {m.firstName} {m.lastName}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)' }}>
                        {m.email}
                      </td>
                      <td>{statusBadge(m)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeFamilyModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
