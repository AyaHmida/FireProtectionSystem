import React, { useState, useEffect } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Zone, CreateZoneDto, UpdateZoneDto } from '../types';
import zoneManagementService from '../services/zoneManagementService';

type ModalType = 'create' | 'edit' | 'delete' | null;

export const ZonesPage: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState<CreateZoneDto>({ name: '', description: '' });

  // Load zones on mount
  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      setLoading(true);
      setError(null);

      // retrieve zones list
      const data = await zoneManagementService.getAllZones();

      // fetch sensor count for each zone in parallel
      const zonesWithCounts: Zone[] = await Promise.all(
        data.map(async (z) => {
          try {
            const res = await zoneManagementService.getSensorCount(z.id);
            return { ...z, sensorCount: res.sensorCount };
          } catch {
            // if count endpoint fails, fall back to existing sensors length or 0
            return { ...z, sensorCount: z.sensors?.length ?? 0 };
          }
        })
      );

      setZones(zonesWithCounts);
    } catch (err: any) {
      setError(err.message || 'Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateZone = async () => {
    if (!formData.name.trim()) {
      setError('Zone name is required');
      return;
    }

    try {
      setLoading(true);
      const newZone = await zoneManagementService.createZone(formData);
      // newly created zone has zero sensors
      setZones([...zones, { ...newZone, sensorCount: 0 }]);
      setModalType(null);
      setFormData({ name: '', description: '' });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create zone');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateZone = async () => {
    if (!selectedZone || !formData.name.trim()) {
      setError('Zone name is required');
      return;
    }

    try {
      setLoading(true);
      const updatedZone = await zoneManagementService.updateZone(selectedZone.id, formData as UpdateZoneDto);
      setZones(zones.map((z) =>
        z.id === selectedZone.id ? { ...updatedZone, sensorCount: z.sensorCount ?? 0 } : z
      ));
      setModalType(null);
      setSelectedZone(null);
      setFormData({ name: '', description: '' });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update zone');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = async () => {
    if (!selectedZone) return;

    try {
      setLoading(true);
      await zoneManagementService.deleteZone(selectedZone.id);
      setZones(zones.filter((z) => z.id !== selectedZone.id));
      setModalType(null);
      setSelectedZone(null);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete zone');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({ name: '', description: '' });
    setSelectedZone(null);
    setModalType('create');
    setError(null);
  };

  const openEditModal = (zone: Zone) => {
    setSelectedZone(zone);
    setFormData({ name: zone.name, description: zone.description });
    setModalType('edit');
    setError(null);
  };

  const openDeleteModal = (zone: Zone) => {
    setSelectedZone(zone);
    setModalType('delete');
    setError(null);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedZone(null);
    setFormData({ name: '', description: '' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && zones.length === 0) {
    return (
      <div>
        <div className="page-hd">
          <div className="page-title">Zone Management</div>
          <div className="page-desc">Manage all security zones and their sensors</div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text2)' }}>
          Loading zones...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-hd">
        <div className="page-title">Zone Management</div>
        <div className="page-desc">Manage all security zones and their sensors</div>
      </div>

      {error && (
        <div style={{
          background: 'var(--danger)20',
          border: '1px solid var(--danger)',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 16,
          color: 'var(--danger)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: 20 }}
          >
            ×
          </button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <button
          className="btn btn-primary"
          onClick={openCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <AddOutlinedIcon sx={{ fontSize: 18 }} /> Create Zone
        </button>
      </div>

      {zones.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text2)' }}>
          <MapOutlinedIcon sx={{ fontSize: 48, color: 'var(--text3)', marginBottom: 2 }} />
          <p>No zones created yet. Create your first zone to get started.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}>
          {zones.map((zone) => (
            <div key={zone.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 600 }}>{zone.name}</h3>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text2)' }}>
                    {zone.description || 'No description'}
                  </p>
                </div>
                <div style={{ background: 'var(--bg2)', padding: '6px 12px', borderRadius: 6, fontSize: 12 }}>
                  <MapOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5, verticalAlign: 'middle' }} />
                </div>
              </div>

              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>Created</span>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{formatDate(zone.createdAt)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>Sensors</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--blue)',
                      background: 'var(--blue)20',
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    {zone.sensorCount ?? zone.sensors?.length ?? 0}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-sm btn-cyan"
                  onClick={() => openEditModal(zone)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <EditOutlinedIcon sx={{ fontSize: 16 }} /> Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => openDeleteModal(zone)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <DeleteOutlinedIcon sx={{ fontSize: 16 }} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Zone Modal */}
      {modalType === 'create' && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              <MapOutlinedIcon sx={{ fontSize: 20, marginRight: 1 }} /> Create New Zone
            </div>
            <div className="modal-sub">Add a new security zone to your system</div>

            <div className="fg">
              <label className="fl">Zone Name *</label>
              <input
                className="fi"
                placeholder="Ex: Living Room, Kitchen, etc."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="fg">
              <label className="fl">Description</label>
              <textarea
                className="fi"
                placeholder="Add details about this zone..."
                style={{ minHeight: 80, fontFamily: 'inherit', resize: 'vertical' }}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateZone} disabled={loading}>
                {loading ? 'Creating...' : ' Create Zone'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Zone Modal */}
      {modalType === 'edit' && selectedZone && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              <EditOutlinedIcon sx={{ fontSize: 20, marginRight: 1 }} /> Edit Zone
            </div>
            <div className="modal-sub">Update zone information</div>

            <div className="fg">
              <label className="fl">Zone Name *</label>
              <input
                className="fi"
                placeholder="Zone name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="fg">
              <label className="fl">Description</label>
              <textarea
                className="fi"
                placeholder="Add details about this zone..."
                style={{ minHeight: 80, fontFamily: 'inherit', resize: 'vertical' }}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdateZone} disabled={loading}>
                {loading ? 'Saving...' : '✅ Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalType === 'delete' && selectedZone && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title" style={{ color: 'var(--danger)' }}>
              ⚠️ Delete Zone
            </div>
            <div className="modal-sub">Are you sure you want to delete this zone?</div>

            <div style={{
              background: 'var(--danger)20',
              border: '1px solid var(--danger)',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              color: 'var(--danger)',
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>{selectedZone.name}</p>
              <p style={{ margin: 0, fontSize: 13 }}>This action cannot be undone.</p>
              {selectedZone.sensors && selectedZone.sensors.length > 0 && (
                <p style={{ margin: '8px 0 0 0', fontSize: 12, color: 'var(--text)' }}>
                  This zone has {selectedZone.sensors.length} sensor(s) that will be affected.
                </p>
              )}
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteZone}
                disabled={loading}
              >
                {loading ? 'Deleting...' : '🗑️ Delete Zone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
