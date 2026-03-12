import React, { useState, useEffect } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Zone, CreateZoneDto, UpdateZoneDto, Occupant } from '../types';
import zoneManagementService from '../services/zoneManagementService';

type ModalType = 'create' | 'edit' | 'delete' | null;

export const ZonesPage: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [occupants, setOccupants] = useState<Occupant[]>([]);
  const [selectedOccupantId, setSelectedOccupantId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState<CreateZoneDto>({
    name: '',
    description: '',
    occupantUserId: 0,
  });

  // ── Charger les occupants au montage ────────────────────────────
  useEffect(() => {
    loadOccupants();
  }, []);

  // ── Charger les zones quand l'occupant sélectionné change ───────
  useEffect(() => {
    if (selectedOccupantId !== null) {
      loadZones(selectedOccupantId);
    } else {
      setZones([]);
    }
  }, [selectedOccupantId]);

  const loadOccupants = async () => {
    try {
      const data = await zoneManagementService.getOccupants();
      setOccupants(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load occupants');
    }
  };

  const loadZones = async (occupantId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await zoneManagementService.getZonesByOccupant(occupantId);
      setZones(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  // ── Create ───────────────────────────────────────────────────────
  const handleCreateZone = async () => {
    if (!formData.name.trim()) return setError('Zone name is required');
    if (!formData.occupantUserId) return setError('Please select an occupant');

    try {
      setLoading(true);
      const newZone = await zoneManagementService.createZone(formData);
      // Rafraîchir la liste si l'occupant créé = occupant sélectionné
      if (selectedOccupantId === formData.occupantUserId) {
        setZones([newZone, ...zones]);
      }
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to create zone');
    } finally {
      setLoading(false);
    }
  };

  // ── Update ───────────────────────────────────────────────────────
  const handleUpdateZone = async () => {
    if (!selectedZone || !formData.name.trim()) return setError('Zone name is required');
    if (!formData.occupantUserId) return setError('Please select an occupant');

    try {
      setLoading(true);
      const updatedZone = await zoneManagementService.updateZone(
        selectedZone.id,
        formData as UpdateZoneDto
      );
      setZones(zones.map((z) => (z.id === selectedZone.id ? updatedZone : z)));
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to update zone');
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────
  const handleDeleteZone = async () => {
    if (!selectedZone) return;

    try {
      setLoading(true);
      await zoneManagementService.deleteZone(selectedZone.id);
      setZones(zones.filter((z) => z.id !== selectedZone.id));
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to delete zone');
    } finally {
      setLoading(false);
    }
  };

  // ── Modals ───────────────────────────────────────────────────────
  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      occupantUserId: selectedOccupantId ?? 0,  // pré-remplir avec l'occupant sélectionné
    });
    setSelectedZone(null);
    setModalType('create');
    setError(null);
  };

  const openEditModal = (zone: Zone) => {
    setSelectedZone(zone);
    setFormData({
      name: zone.name,
      description: zone.description ?? '',
      occupantUserId: zone.userId,
    });
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
    setFormData({ name: '', description: '', occupantUserId: selectedOccupantId ?? 0 });
    setError(null);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div>
      <div className="page-hd">
        <div className="page-title">Zone Management</div>
        <div className="page-desc">Manage security zones per occupant</div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          background: 'var(--danger)20', border: '1px solid var(--danger)',
          borderRadius: 8, padding: '12px 16px', marginBottom: 16,
          color: 'var(--danger)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>{error}</span>
          <button onClick={() => setError(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: 20 }}>
            ×
          </button>
        </div>
      )}

      {/* ── Filtre par occupant + bouton Create ─────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16 }}>

        {/* Dropdown occupant */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 380 }}>
          <PersonOutlinedIcon sx={{ color: 'var(--text2)', fontSize: 20 }} />
          <select
            className="fi"
            style={{ flex: 1 }}
            value={selectedOccupantId ?? ''}
            onChange={(e) => setSelectedOccupantId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">— Select an occupant —</option>
            {occupants.map((o) => (
              <option key={o.id} value={o.id}>
                {o.firstName} {o.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton Create (désactivé si aucun occupant sélectionné) */}
        <button
          className="btn btn-primary"
          onClick={openCreateModal}
          disabled={selectedOccupantId === null}
          style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: selectedOccupantId === null ? 0.5 : 1 }}
        >
          <AddOutlinedIcon sx={{ fontSize: 18 }} /> Create Zone
        </button>
      </div>

      {/* ── État vide ────────────────────────────────────────────── */}
      {selectedOccupantId === null ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text2)' }}>
          <PersonOutlinedIcon sx={{ fontSize: 48, color: 'var(--text3)', marginBottom: 2 }} />
          <p>Select an occupant to view their zones.</p>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text2)' }}>
          Loading zones...
        </div>
      ) : zones.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text2)' }}>
          <MapOutlinedIcon sx={{ fontSize: 48, color: 'var(--text3)', marginBottom: 2 }} />
          <p>No zones for this occupant. Create the first one.</p>
        </div>
      ) : (
        /* ── Grille des zones ──────────────────────────────────── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {zones.map((zone) => (
            <div key={zone.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 600 }}>{zone.name}</h3>
                  <p style={{ margin: '0 0 6px 0', fontSize: 13, color: 'var(--text2)' }}>
                    {zone.description || 'No description'}
                  </p>
                  {/* Nom de l'occupant */}
                  {zone.occupantName && (
                    <span style={{
                      fontSize: 11, color: 'var(--blue)',
                      background: 'var(--blue)15', padding: '2px 8px',
                      borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      <PersonOutlinedIcon sx={{ fontSize: 12 }} />
                      {zone.occupantName}
                    </span>
                  )}
                </div>
                <div style={{ background: 'var(--bg2)', padding: '6px 12px', borderRadius: 6 }}>
                  <MapOutlinedIcon sx={{ fontSize: 16 }} />
                </div>
              </div>

              <div style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: 12, marginBottom: 16,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>Created</span>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{formatDate(zone.createdAt)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>Sensors</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: 'var(--blue)',
                    background: 'var(--blue)20', padding: '2px 8px', borderRadius: 4,
                  }}>
                    {zone.sensorCount ?? 0}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-sm btn-cyan" onClick={() => openEditModal(zone)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <EditOutlinedIcon sx={{ fontSize: 16 }} /> Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => openDeleteModal(zone)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <DeleteOutlinedIcon sx={{ fontSize: 16 }} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal Create ─────────────────────────────────────────── */}
      {modalType === 'create' && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title"><MapOutlinedIcon sx={{ fontSize: 20, marginRight: 1 }} /> Create New Zone</div>
            <div className="modal-sub">Add a new zone for the selected occupant</div>

            <div className="fg">
              <label className="fl">Occupant *</label>
              <select
                className="fi"
                value={formData.occupantUserId || ''}
                onChange={(e) => setFormData({ ...formData, occupantUserId: Number(e.target.value) })}
              >
                <option value="">— Select an occupant —</option>
                {occupants.map((o) => (
                  <option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>
                ))}
              </select>
            </div>

            <div className="fg">
              <label className="fl">Zone Name *</label>
              <input className="fi" placeholder="Ex: Living Room, Kitchen..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="fg">
              <label className="fl">Description</label>
              <textarea className="fi" placeholder="Zone details..."
                style={{ minHeight: 80, fontFamily: 'inherit', resize: 'vertical' }}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateZone} disabled={loading}>
                {loading ? 'Creating...' : 'Create Zone'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Edit ───────────────────────────────────────────── */}
      {modalType === 'edit' && selectedZone && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title"><EditOutlinedIcon sx={{ fontSize: 20, marginRight: 1 }} /> Edit Zone</div>
            <div className="modal-sub">Update zone information</div>

            <div className="fg">
              <label className="fl">Occupant *</label>
              <select className="fi"
                value={formData.occupantUserId || ''}
                onChange={(e) => setFormData({ ...formData, occupantUserId: Number(e.target.value) })}>
                <option value="">— Select an occupant —</option>
                {occupants.map((o) => (
                  <option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>
                ))}
              </select>
            </div>

            <div className="fg">
              <label className="fl">Zone Name *</label>
              <input className="fi" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="fg">
              <label className="fl">Description</label>
              <textarea className="fi"
                style={{ minHeight: 80, fontFamily: 'inherit', resize: 'vertical' }}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpdateZone} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Delete ─────────────────────────────────────────── */}
      {modalType === 'delete' && selectedZone && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title" style={{ color: 'var(--danger)' }}>⚠️ Delete Zone</div>
            <div className="modal-sub">Are you sure you want to delete this zone?</div>

            <div style={{
              background: 'var(--danger)20', border: '1px solid var(--danger)',
              borderRadius: 8, padding: 12, marginBottom: 16, color: 'var(--danger)',
            }}>
              <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>{selectedZone.name}</p>
              <p style={{ margin: 0, fontSize: 13 }}>
                This will disassociate all sensors linked to this zone.
              </p>
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteZone} disabled={loading}>
                {loading ? 'Deleting...' : 'Delete Zone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
