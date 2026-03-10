import React, { useState, useEffect } from 'react';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import userManagementService from '../services/userManagementService';
import { UserAdminDto } from '../types';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserAdminDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<{ user: UserAdminDto; action: string } | null>(null);
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [tab, setTab] = useState<string>('all');
  
  const getFilteredUsers = () => {
  if (tab === 'active') {
    return users.filter((u) => u.isActive === true && u.isSuspended === false);
  }

  if (tab === 'suspended') {
    return users.filter((u) =>u.isActive === false &&  u.isSuspended === true);
  }

  // all
  return users;
};

const filtered = getFilteredUsers();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const users = await userManagementService.getAllUsers();
      setUsers(users);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!actionModal) return;
    setModalError(null);
    try {
      setActionLoading(true);
      const { user, action } = actionModal;

      switch (action) {
        case 'suspend':
          if (!reason.trim()) {
            setError('Reason is required for suspension');
            setActionLoading(false);
            return;
          }
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
      setActionModal(null);
      setReason('');
    } catch (err) {
      const body = (err as any)?.body;
      if (body && body.errors) {
          const parts: string[] = [];
          for (const [key, v] of Object.entries(body.errors)) {
            if (Array.isArray(v)) parts.push(`${key}: ${v.join(' ')}`);
            else parts.push(`${key}: ${String(v)}`);
          }
          setModalError(parts.join(' '));
      } else {
        setError(`Action failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div style={{ padding: 12, marginBottom: 16, background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, color: '#991b1b' }}>
          {error}
        </div>
      )}

      <div className="page-hd">
        <div className="page-title">Users Management</div>
        <div className="page-desc">Account validation, suspension and deletion</div>
      </div>

      <div className="tabs">
        {['all', 'active', 'suspended'].map((t) => (
          <div key={t} className={`tab ${tab === t ? 'on' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
            {t === 'all' ? 'All' : t === 'active' ? 'Active' : 'Suspended'}
          </div>
        ))}
      </div>

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
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 13,
                          flexShrink: 0,
                        }}
                      >
                        {u.firstName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{u.firstName} {u.lastName}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)' }}>{u.email}</td>
                  <td>
                      <span className={`bd ${u.role === 'Occupant' ? 'bd-purple' : 'bd-blue'}`}>{u.role === 'Occupant' ? 'Occupant' : 'Family Member'}</span>
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`bd ${u.isSuspended ? 'bd-red' : u.isActive ? 'bd-green' : 'bd-yellow'}`}>
                      {u.isSuspended ? 'Suspended' : u.isActive ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {u.isSuspended ? (
                        <button
                          className="btn btn-sm btn-green"
                          onClick={() => setActionModal({ user: u, action: 'activate' })}
                          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <PlayArrowOutlinedIcon sx={{ fontSize: 16 }} />
                          Activate
                        </button>
                      ) : !u.isActive ? (
                        <button
                          className="btn btn-sm btn-green"
                          onClick={() => setActionModal({ user: u, action: 'validate' })}
                          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          Validate
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => { setActionModal({ user: u, action: 'suspend' }); setReason(''); }}
                          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <PauseOutlinedIcon sx={{ fontSize: 16 }} />
                          Suspend
                        </button>
                      )}
                      <button className="btn btn-sm btn-danger" onClick={() => { setActionModal({ user: u, action: 'delete' }); setReason(''); }}>
                        <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {actionModal && (
        <div className="overlay" onClick={() => setActionModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {actionModal.action === 'suspend' ? (
                <>
                  <PauseOutlinedIcon sx={{ fontSize: 20 }} />
                  Suspend Account
                </>
              ) : actionModal.action === 'activate' ? (
                <>
                  <PlayArrowOutlinedIcon sx={{ fontSize: 20 }} />
                  Activate Account
                </>
                ) : actionModal.action === 'validate' ? (
  <>
    <PlayArrowOutlinedIcon sx={{ fontSize: 20 }} />
    Validate Account
  </>
              ) : (
                <>
                  <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                  Delete Account
                </>
              )}
            </div>
            <div className="modal-sub">
              User: <strong>{actionModal.user.firstName} {actionModal.user.lastName}</strong>
            </div>
            {modalError && (
  <div style={{ color: '#dc2626', marginBottom: 12, fontSize: 13 }}>
                {modalError}
              </div>
            )}
            {actionModal.action === 'suspend'  && (
              <div className="fg">
                <label className="fl">Reason (required)</label>
                <input 
                  className="fi reason-field" 
                  placeholder="Specify the reason for this action..." 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={actionLoading}
                />
              </div>
            )}
            <div className="modal-foot">
              <button 
                className="btn btn-secondary" 
                onClick={() => { setActionModal(null); setModalError(null); }}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
className={`btn ${
  actionModal.action === 'activate' || actionModal.action === 'validate'
    ? 'btn-green'
    : 'btn-danger'
}`}                onClick={handleAction}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : (
                  actionModal.action === 'suspend'
                    ? ' Confirm Suspension'
                    : actionModal.action === 'activate'
                    ? ' Activate Account'
                     : actionModal.action === 'validate'
  ? 'Validate Account'
  : 'Confirm Deletion'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
