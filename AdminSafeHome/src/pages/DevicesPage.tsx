import React, { useState, useEffect } from 'react';
import AddOutlinedIcon       from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon      from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon    from '@mui/icons-material/DeleteOutlined';
import RouterOutlinedIcon    from '@mui/icons-material/RouterOutlined';
import LinkOutlinedIcon      from '@mui/icons-material/LinkOutlined';
import LinkOffOutlinedIcon   from '@mui/icons-material/LinkOffOutlined';
import PersonOutlinedIcon    from '@mui/icons-material/PersonOutlined';
import MapOutlinedIcon       from '@mui/icons-material/MapOutlined';
import { Device, CreateDeviceDto } from '../types/Devicetypes';
import { Occupant, Zone } from '../types';
import deviceManagementService from '../services/Devicemanagementservice';
import zoneManagementService   from '../services/zoneManagementService';

type ModalType = 'create' | 'edit' | 'delete' | 'assign' | null;

export const DevicesPage: React.FC = () => {
  const [devices, setDevices]           = useState<Device[]>([]);
  const [occupants, setOccupants]       = useState<Occupant[]>([]);
  const [selectedOccupantId, setSelectedOccupantId] = useState<number | null>(null);

  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [modalType, setModalType]       = useState<ModalType>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Formulaire create / edit
  const [formData, setFormData] = useState<CreateDeviceDto>({
    deviceId: '', name: '', description: '', occupantUserId: 0,
  });

  // Formulaire assign
  const [assignOccupantId, setAssignOccupantId] = useState<number | null>(null);
  const [assignZoneId, setAssignZoneId]         = useState<number | null>(null);
  const [filteredZones, setFilteredZones]       = useState<Zone[]>([]);

  // ── Charger les occupants au montage ─────────────────────────
  useEffect(() => { loadOccupants(); }, []);

  // ── Charger les devices quand l'occupant change ──────────────
  useEffect(() => {
    if (selectedOccupantId !== null) loadDevices(selectedOccupantId);
    else setDevices([]);
  }, [selectedOccupantId]);

  const loadOccupants = async () => {
    try {
      const data = await zoneManagementService.getOccupants();
      setOccupants(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load occupants');
    }
  };

  const loadDevices = async (occupantId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await deviceManagementService.getDevicesByOccupant(occupantId);
      setDevices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  // ── Zones filtrées dans le modal Assign ──────────────────────
  const handleAssignOccupantChange = async (occupantId: number | null) => {
    setAssignOccupantId(occupantId);
    setAssignZoneId(null);
    setFilteredZones([]);
    if (!occupantId) return;
    try {
      const zones = await zoneManagementService.getZonesByOccupant(occupantId);
      setFilteredZones(zones);
    } catch { setFilteredZones([]); }
  };

  // ── CREATE ────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!formData.deviceId.trim()) return setError('Device ID is required');
    if (!formData.name.trim())     return setError('Name is required');

    try {
      setLoading(true);
      const created = await deviceManagementService.createDevice({
        ...formData,
        occupantUserId: selectedOccupantId!,
      });
      setDevices(prev => [created, ...prev]); // ← apparaît immédiatement dans la liste
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to create device');
    } finally {
      setLoading(false);
    }
  };

  // ── UPDATE ────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!selectedDevice)           return;
    if (!formData.deviceId.trim()) return setError('Device ID is required');
    if (!formData.name.trim())     return setError('Name is required');

    try {
      setLoading(true);
      const updated = await deviceManagementService.updateDevice(selectedDevice.id, formData);
      setDevices(prev => prev.map(d => d.id === selectedDevice.id ? updated : d));
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to update device');
    } finally {
      setLoading(false);
    }
  };

  // ── DELETE ────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!selectedDevice) return;
    try {
      setLoading(true);
      await deviceManagementService.deleteDevice(selectedDevice.id);
      setDevices(prev => prev.filter(d => d.id !== selectedDevice.id));
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to delete device');
    } finally {
      setLoading(false);
    }
  };

  // ── ASSIGN TO ZONE ────────────────────────────────────────────
  const handleAssign = async () => {
    if (!selectedDevice) return;
    if (!assignZoneId)   return setError('Please select a zone');
    try {
      setLoading(true);
      const updated = await deviceManagementService.assignToZone(
        selectedDevice.id, { zoneId: assignZoneId }
      );
      setDevices(prev => prev.map(d => d.id === selectedDevice.id ? updated : d));
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to assign device');
    } finally {
      setLoading(false);
    }
  };

  // ── UNASSIGN ──────────────────────────────────────────────────
  const handleUnassign = async (device: Device) => {
    try {
      const updated = await deviceManagementService.unassignFromZone(device.id);
      setDevices(prev => prev.map(d => d.id === device.id ? updated : d));
    } catch (err: any) {
      setError(err.message || 'Failed to unassign device');
    }
  };

  // ── MODALS ────────────────────────────────────────────────────
  const openCreateModal = () => {
    setFormData({ deviceId: '', name: '', description: '', occupantUserId: selectedOccupantId! });
    setModalType('create');
    setError(null);
  };

  const openEditModal = (device: Device) => {
    setSelectedDevice(device);
    setFormData({
      deviceId: device.deviceId, name: device.name,
      description: device.description ?? '', occupantUserId: device.occupantId ?? 0,
    });
    setModalType('edit');
    setError(null);
  };

  const openDeleteModal = (device: Device) => {
    setSelectedDevice(device);
    setModalType('delete');
    setError(null);
  };

  const openAssignModal = (device: Device) => {
    setSelectedDevice(device);
    // Pré-sélectionner l'occupant du device dans le modal assign
    const occupantId = device.occupantId ?? null;
    setAssignOccupantId(occupantId);
    setAssignZoneId(null);
    setFilteredZones([]);
    if (occupantId) handleAssignOccupantChange(occupantId);
    setModalType('assign');
    setError(null);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedDevice(null);
    setFormData({ deviceId: '', name: '', description: '', occupantUserId: selectedOccupantId ?? 0 });
    setAssignOccupantId(null);
    setAssignZoneId(null);
    setFilteredZones([]);
    setError(null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const selectedOccupantLabel = occupants.find(o => o.id === selectedOccupantId);

  // ── RENDER ────────────────────────────────────────────────────
  return (
    <div>
      <div className="page-hd">
        <div className="page-title">Device Management</div>
        <div className="page-desc">Register and manage ESP32 devices per occupant</div>
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

      {/* ── Dropdown occupant + bouton Add ───────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 380 }}>
          <PersonOutlinedIcon sx={{ color: 'var(--text2)', fontSize: 20 }} />
          <select className="fi" style={{ flex: 1 }}
            value={selectedOccupantId ?? ''}
            onChange={e => setSelectedOccupantId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">— Select an occupant —</option>
            {occupants.map(o => (
              <option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>
            ))}
          </select>
        </div>

        {/* Bouton désactivé si aucun occupant sélectionné */}
        <button
          className="btn btn-primary"
          onClick={openCreateModal}
          disabled={selectedOccupantId === null}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            opacity: selectedOccupantId === null ? 0.5 : 1,
            cursor: selectedOccupantId === null ? 'not-allowed' : 'pointer',
          }}>
          <AddOutlinedIcon sx={{ fontSize: 18 }} /> Add Device
        </button>
      </div>

      {/* ── États ────────────────────────────────────────────── */}
      {selectedOccupantId === null ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text2)' }}>
          <PersonOutlinedIcon sx={{ fontSize: 48, color: 'var(--text3)', marginBottom: 2 }} />
          <p>Select an occupant to view their devices.</p>
        </div>

      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text2)' }}>
          Loading devices...
        </div>

      ) : devices.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text2)' }}>
          <RouterOutlinedIcon sx={{ fontSize: 48, color: 'var(--text3)', marginBottom: 2 }} />
          <p>No devices for this occupant. Add the first one.</p>
        </div>

      ) : (
        /* ── Grille des devices ──────────────────────────────── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {devices.map(device => (
            <div key={device.id} className="card" style={{ padding: 20 }}>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <RouterOutlinedIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{device.name}</h3>
                  </div>
                  <span style={{
                    fontSize: 11, fontFamily: 'monospace',
                    background: 'var(--bg2)', padding: '2px 8px',
                    borderRadius: 4, color: 'var(--text2)',
                  }}>
                    {device.deviceId}
                  </span>
                </div>

                {/* Badge En ligne / Hors ligne */}
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 12,
                  background: device.isOnline ? '#10b98120' : '#ef444420',
                  color: device.isOnline ? '#10b981' : '#ef4444',
                  display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', display: 'inline-block',
                    background: device.isOnline ? '#10b981' : '#ef4444',
                  }} />
                  {device.isOnline ? 'En ligne' : 'Hors ligne'}
                </span>
              </div>

              {device.description && (
                <p style={{ fontSize: 12, color: 'var(--text2)', margin: '0 0 12px 0' }}>
                  {device.description}
                </p>
              )}

              {/* Infos */}
              <div style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: 12, marginBottom: 12,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapOutlinedIcon sx={{ fontSize: 13 }} /> Zone
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    {device.zoneName
                      ? <span style={{ color: '#06b6d4' }}>{device.zoneName}</span>
                      : <span style={{ color: 'var(--text3)', fontStyle: 'italic' }}>Not assigned</span>
                    }
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <PersonOutlinedIcon sx={{ fontSize: 13 }} /> Occupant
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    {device.occupantName ?? '—'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>Sensors</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: '#8b5cf6',
                    background: '#8b5cf620', padding: '2px 8px', borderRadius: 4,
                  }}>
                    {device.sensorCount}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>
                Added {formatDate(device.createdAt)}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-sm btn-cyan" onClick={() => openEditModal(device)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <EditOutlinedIcon sx={{ fontSize: 14 }} /> Edit
                </button>

                <button onClick={() => device.zoneId ? handleUnassign(device) : openAssignModal(device)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    padding: '6px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    background: device.zoneId ? '#f59e0b20' : '#10b98120',
                    color: device.zoneId ? '#f59e0b' : '#10b981',
                    border: `1px solid ${device.zoneId ? '#f59e0b' : '#10b981'}`,
                  }}>
                  {device.zoneId
                    ? <><LinkOffOutlinedIcon sx={{ fontSize: 14 }} /> Unassign</>
                    : <><LinkOutlinedIcon sx={{ fontSize: 14 }} /> Assign</>
                  }
                </button>

                <button className="btn btn-sm btn-danger" onClick={() => openDeleteModal(device)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <DeleteOutlinedIcon sx={{ fontSize: 14 }} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL CREATE
      ══════════════════════════════════════════════════════════ */}
      {modalType === 'create' && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              <RouterOutlinedIcon sx={{ fontSize: 20, marginRight: 1 }} /> Add New Device
            </div>
            <div className="modal-sub">Register a new ESP32 device</div>

            {/* Occupant en readonly — pré-rempli */}
            <div className="fg">
              <label className="fl">
                <PersonOutlinedIcon sx={{ fontSize: 13, marginRight: 0.5, verticalAlign: 'middle' }} />
                Occupant
              </label>
              <div className="fi" style={{
                background: 'var(--bg2)', color: 'var(--text2)',
                cursor: 'default', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <PersonOutlinedIcon sx={{ fontSize: 14, color: '#8b5cf6' }} />
                {selectedOccupantLabel
                  ? `${selectedOccupantLabel.firstName} ${selectedOccupantLabel.lastName}`
                  : '—'
                }
              </div>
            </div>

            <div className="fg">
              <label className="fl">Device ID *</label>
              <input className="fi" placeholder="Ex: ESP32-001"
                value={formData.deviceId}
                onChange={e => setFormData({ ...formData, deviceId: e.target.value })} />
            </div>

            <div className="fg">
              <label className="fl">Name *</label>
              <input className="fi" placeholder="Ex: Capteur Salon"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="fg">
              <label className="fl">Description</label>
              <textarea className="fi" placeholder="Optional..."
                style={{ minHeight: 70, fontFamily: 'inherit', resize: 'vertical' }}
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
                {loading ? 'Adding...' : 'Add Device'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL EDIT
      ══════════════════════════════════════════════════════════ */}
      {modalType === 'edit' && selectedDevice && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              <EditOutlinedIcon sx={{ fontSize: 20, marginRight: 1 }} /> Edit Device
            </div>
            <div className="modal-sub">Update device information</div>

            <div className="fg">
              <label className="fl">Device ID *</label>
              <input className="fi" value={formData.deviceId}
                onChange={e => setFormData({ ...formData, deviceId: e.target.value })} />
            </div>
            <div className="fg">
              <label className="fl">Name *</label>
              <input className="fi" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="fg">
              <label className="fl">Description</label>
              <textarea className="fi"
                style={{ minHeight: 70, fontFamily: 'inherit', resize: 'vertical' }}
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpdate} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL ASSIGN ZONE  (US-A3)
          Occupant pré-rempli depuis le device
          Zone filtrée par cet occupant
      ══════════════════════════════════════════════════════════ */}
      {modalType === 'assign' && selectedDevice && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              <LinkOutlinedIcon sx={{ fontSize: 20, marginRight: 1 }} /> Assign to Zone
            </div>
            <div className="modal-sub">
              Link <strong>{selectedDevice.name}</strong> ({selectedDevice.deviceId}) to a zone
            </div>

            {selectedDevice.zoneId && (
              <div style={{
                background: '#f59e0b15', border: '1px solid #f59e0b',
                borderRadius: 8, padding: '10px 12px', marginBottom: 12,
                fontSize: 12, color: '#f59e0b',
              }}>
                ⚠️ Currently assigned to <strong>{selectedDevice.zoneName}</strong>. Will be reassigned.
              </div>
            )}

            {/* Occupant — pré-rempli, modifiable si besoin */}
            <div className="fg">
              <label className="fl">
                <PersonOutlinedIcon sx={{ fontSize: 13, marginRight: 0.5, verticalAlign: 'middle' }} />
                Occupant *
              </label>
              <select className="fi"
                value={assignOccupantId ?? ''}
                onChange={e => handleAssignOccupantChange(e.target.value ? Number(e.target.value) : null)}>
                <option value="">— Select an occupant —</option>
                {occupants.map(o => (
                  <option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>
                ))}
              </select>
            </div>

            {/* Zone — filtrée par l'occupant, désactivée si pas d'occupant */}
            <div className="fg">
              <label className="fl">
                <MapOutlinedIcon sx={{ fontSize: 13, marginRight: 0.5, verticalAlign: 'middle' }} />
                Zone *
              </label>
              <select className="fi"
                value={assignZoneId ?? ''}
                disabled={!assignOccupantId}
                onChange={e => setAssignZoneId(Number(e.target.value))}>
                <option value="">
                  {!assignOccupantId
                    ? '— Select an occupant first —'
                    : filteredZones.length === 0
                      ? 'No zones for this occupant'
                      : '— Select a zone —'
                  }
                </option>
                {filteredZones.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAssign}
                disabled={loading || !assignZoneId}>
                {loading ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL DELETE
      ══════════════════════════════════════════════════════════ */}
      {modalType === 'delete' && selectedDevice && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title" style={{ color: '#ef4444' }}>⚠️ Delete Device</div>
            <div className="modal-sub">This action cannot be undone</div>

            <div style={{
              background: '#ef444420', border: '1px solid #ef4444',
              borderRadius: 8, padding: 12, marginBottom: 16, color: '#ef4444',
            }}>
              <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>
                {selectedDevice.name}
                <span style={{ fontFamily: 'monospace', fontSize: 12, marginLeft: 8, opacity: 0.8 }}>
                  {selectedDevice.deviceId}
                </span>
              </p>
              <p style={{ margin: 0, fontSize: 13 }}>
                All sensors linked to this device will be disassociated.
              </p>
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
                {loading ? 'Deleting...' : 'Delete Device'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
