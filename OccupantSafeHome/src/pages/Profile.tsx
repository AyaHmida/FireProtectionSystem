import { useState } from 'react'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import DevicesOtherOutlinedIcon from '@mui/icons-material/DevicesOtherOutlined'

function Profile() {
  const [editMode, setEditMode] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [userData, setUserData] = useState({
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    phone: '+33 6 12 34 56 78',
    address: '42 Rue de la Paix, 75000 Paris',
  })

  return (
    <div>
      <div className="page-header">
        <div className="page-title">User Profile</div>
        <div className="page-desc">Manage your personal information and security preferences</div>
      </div>

      <div className="card section-gap">
        <div className="card-header">
          <span className="card-title">Personal Information</span>
          <button
            className="btn btn-secondary btn-small"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? (
              <>
                <CloseOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Cancel
              </>
            ) : (
              <>
                <EditOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Edit
              </>
            )}
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24,
            paddingBottom: 24,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              background: 'var(--surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
            }}
          >
            <PersonOutlinedIcon sx={{ fontSize: 40 }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
              {userData.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 2 }}>
              {userData.email}
            </div>
            <div className="badge badge-green">
              <CheckCircleOutlinedIcon sx={{ fontSize: 14, marginRight: 0.5 }} /> Active Account
            </div>
          </div>
        </div>

        {!editMode ? (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4 }}>
                Nom complet
              </div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{userData.name}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4 }}>
                Email
              </div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{userData.email}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4 }}>
                Téléphone
              </div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{userData.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4 }}>
                Address
              </div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{userData.address}</div>
            </div>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={userData.name}
                onChange={e => setUserData({ ...userData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={userData.email}
                onChange={e => setUserData({ ...userData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-input"
                type="tel"
                value={userData.phone}
                onChange={e => setUserData({ ...userData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                className="form-input"
                value={userData.address}
                onChange={e => setUserData({ ...userData, address: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-primary"
                onClick={() => setEditMode(false)}
              >
                <CheckCircleOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Save
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card section-gap">
        <div className="card-header">
          <span className="card-title">Security</span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
              Password
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>
              Change your password to keep your account secure
            </div>
            <button
              className="btn btn-secondary btn-small"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
            >
              {showPasswordChange ? (
                <>
                  <CloseOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Cancel
                </>
              ) : (
                <>
                  <DownloadOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Change Password
                </>
              )}
            </button>
          </div>

          {showPasswordChange && (
            <div>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-input" placeholder="••••••••" />
              </div>
              <button className="btn btn-primary btn-small">
                <CheckCircleOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Update
              </button>
            </div>
          )}
        </div>

        <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
            Biometric Authentication
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>
            Enable facial recognition or fingerprint
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <div className="toggle-track" />
            <div className="toggle-thumb" />
          </label>
        </div>
      </div>

      <div className="card section-gap">
        <div className="card-header">
          <span className="card-title">Session & Data</span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>
            JWT Token
          </div>
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: 6,
              padding: '8px 12px',
              fontFamily: 'var(--mono)',
              fontSize: 10,
              color: 'var(--accent)',
              overflow: 'auto',
            }}
          >
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkplYW4gTWFydGluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>
            Account created on <strong>January 15, 2024</strong>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>
            Last login <strong>2 hours ago</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-secondary">
            <DevicesOtherOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Connected Devices
          </button>
          <button className="btn btn-danger">
            <CloseOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Logout Everywhere
          </button>
        </div>
      </div>

      <div className="card section-gap">
        <div className="card-header">
          <span className="card-title">Preferences</span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Email Notifications</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
                Receive alerts by email
              </div>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <div className="toggle-track" />
              <div className="toggle-thumb" />
            </label>
          </div>
        </div>

        <div style={{ marginBottom: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>SMS Notifications</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
                Receive alerts by SMS
              </div>
            </div>
            <label className="toggle">
              <input type="checkbox" />
              <div className="toggle-track" />
              <div className="toggle-thumb" />
            </label>
          </div>
        </div>

        <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Weekly Reports</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
                Weekly activity summary
              </div>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <div className="toggle-track" />
              <div className="toggle-thumb" />
            </label>
          </div>
        </div>
      </div>

      <div className="card section-gap">
        <div className="card-header">
          <span className="card-title">Danger Zone</span>
        </div>

        <div
          style={{
            background: 'rgba(239, 68, 68, .08)',
            border: '1px solid rgba(239, 68, 68, .2)',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>
            ⚠️ Actions in this zone are permanent and cannot be undone.
          </div>
        </div>

        <button className="btn btn-danger" style={{ marginBottom: 8 }}>
          <DownloadOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Download My Data
        </button>
        <button className="btn btn-danger">Delete My Account</button>
      </div>
    </div>
  )
}

export default Profile
