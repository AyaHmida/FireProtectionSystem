import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';
import EditIcon from '@mui/icons-material/EditOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import CancelIcon from '@mui/icons-material/ClearOutlined';
import './profilePage.css';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const fullName = user ? `${user.firstName} ${user.lastName}` : '';
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    role: user?.role || '',
    phone: '+212 6 12 34 56 78',
    department: 'Administration',
    lastLogin: '2024-02-21 14:32:00',
    joinDate: '2024-01-15 10:00:00',
  });

  const [editData, setEditData] = useState(formData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(formData);
  };

  const handleSave = () => {
    setFormData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(formData);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <Card className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {user?.firstName?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        <div className="profile-header-info">
          <h1>{fullName}</h1>
          <p className="profile-role">{formData.role}</p>
          <p className="profile-email">{formData.email}</p>
        </div>
        <div className="profile-actions">
          {!isEditing && (
            <Button 
              variant="primary"
              onClick={handleEdit}
              className="edit-btn"
            >
              <EditIcon sx={{ fontSize: 16, marginRight: '8px' }} />
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      {/* Profile Information */}
      <div className="profile-grid">
        {/* Personal Information */}
        <Card className="profile-section">
          <h2 className="section-title">Personal Information</h2>
          <div className="form-group">
            <label>First Name</label>
            {isEditing ? (
              <Input
                type="text"
                value={editData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="First Name"
              />
            ) : (
              <div className="field-value">{formData.firstName}</div>
            )}
          </div>

          <div className="form-group">
            <label>Last Name</label>
            {isEditing ? (
              <Input
                type="text"
                value={editData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Last Name"
              />
            ) : (
              <div className="field-value">{formData.lastName}</div>
            )}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            {isEditing ? (
              <Input
                type="email"
                value={editData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Email"
              />
            ) : (
              <div className="field-value">{formData.email}</div>
            )}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            {isEditing ? (
              <Input
                type="tel"
                value={editData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Phone"
              />
            ) : (
              <div className="field-value">{formData.phone}</div>
            )}
          </div>
        </Card>

        {/* Professional Information */}
        <Card className="profile-section">
          <h2 className="section-title">Professional Information</h2>
          <div className="form-group">
            <label>Role</label>
            <div className="field-value">{formData.role}</div>
          </div>

          <div className="form-group">
            <label>Department</label>
            {isEditing ? (
              <Input
                type="text"
                value={editData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                placeholder="Department"
              />
            ) : (
              <div className="field-value">{formData.department}</div>
            )}
          </div>

          <div className="form-group">
            <label>Last Login</label>
            <div className="field-value">{formData.lastLogin}</div>
          </div>

          <div className="form-group">
            <label>Join Date</label>
            <div className="field-value">{formData.joinDate}</div>
          </div>
        </Card>
      </div>

      {/* Account Security */}
      <Card className="profile-section">
        <h2 className="section-title">Account Security</h2>
        <div className="security-info">
          <div className="security-item">
            <div className="security-icon">🔒</div>
            <div className="security-content">
              <h3>Change Password</h3>
              <p>Update your password to keep your account secure</p>
            </div>
            <Button variant="secondary">Change</Button>
          </div>
          <div className="security-item">
            <div className="security-icon">📱</div>
            <div className="security-content">
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account</p>
            </div>
            <Button variant="secondary">Enable</Button>
          </div>
        </div>
      </Card>

      {/* Edit Actions */}
      {isEditing && (
        <div className="edit-actions">
          <Button 
            variant="primary"
            onClick={handleSave}
            className="save-btn"
          >
            <SaveIcon sx={{ fontSize: 16, marginRight: '8px' }} />
            Save Changes
          </Button>
          <Button 
            variant="secondary"
            onClick={handleCancel}
            className="cancel-btn"
          >
            <CancelIcon sx={{ fontSize: 16, marginRight: '8px' }} />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
