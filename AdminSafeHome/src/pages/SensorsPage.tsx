import React, { useState, useEffect } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Sensor, Zone, CreateSensorDto, UpdateSensorDto } from '../types';
import sensorManagementService from '../services/sensorManagementService';
import zoneManagementService from '../services/zoneManagementService';

type ModalType = 'create' | 'edit' | 'delete' | 'detail' | null;

export const SensorsPage: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [filterZone, setFilterZone] = useState<string>('all');

  const [formData, setFormData] = useState<CreateSensorDto>({
    macAddress: '',
    label: '',
    type: 'GAS',
    thresholdValue: 500,
    zoneId: 0,
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sensorsData, zonesData] = await Promise.all([
        sensorManagementService.getAllSensors(),
        zoneManagementService.getAllZones(),
      ]);
      setSensors(sensorsData);
      setZones(zonesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSensor = async () => {
    if (!formData.macAddress.trim() || !formData.label.trim() || formData.zoneId === 0) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const newSensor = await sensorManagementService.createSensor(formData);
      setSensors([...sensors, newSensor]);
      setModalType(null);
      setFormData({
        macAddress: '',
        label: '',
        type: 'GAS',
        thresholdValue: 500,
        zoneId: 0,
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create sensor');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSensor = async () => {
    if (!selectedSensor || !formData.label.trim() || formData.zoneId === 0) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const updateDto: UpdateSensorDto = {
        label: formData.label,
        type: formData.type,
        thresholdValue: formData.thresholdValue,
        zoneId: formData.zoneId,
      };
      const updatedSensor = await sensorManagementService.updateSensor(selectedSensor.id, updateDto);
      setSensors(sensors.map((s) => (s.id === selectedSensor.id ? updatedSensor : s)));
      setModalType(null);
      setSelectedSensor(null);
      setFormData({
        macAddress: '',
        label: '',
        type: 'GAS',
        thresholdValue: 500,
        zoneId: 0,
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update sensor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSensor = async () => {
    if (!selectedSensor) return;

    try {
      setLoading(true);
      await sensorManagementService.deleteSensor(selectedSensor.id);
      setSensors(sensors.filter((s) => s.id !== selectedSensor.id));
      setModalType(null);
      setSelectedSensor(null);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete sensor');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      macAddress: '',
      label: '',
      type: 'GAS',
      thresholdValue: 500,
      zoneId: zones.length > 0 ? zones[0].id : 0,
    });
    setSelectedSensor(null);
    setModalType('create');
    setError(null);
  };

  const openEditModal = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setFormData({
      macAddress: sensor.macAddress,
      label: sensor.label,
      type: sensor.type,
      thresholdValue: sensor.thresholdValue,
      zoneId: sensor.zoneId,
    });
    setModalType('edit');
    setError(null);
  };

  const openDeleteModal = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setModalType('delete');
    setError(null);
  };

  const openDetailModal = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setModalType('detail');
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedSensor(null);
    setFormData({
      macAddress: '',
      label: '',
      type: 'GAS',
      thresholdValue: 500,
      zoneId: 0,
    });
  };

  // Filter sensors
  const filteredSensors = sensors.filter((s) => {
    const statusMatch = filter === 'all' || s.status.toUpperCase() === filter.toUpperCase();
    const zoneMatch = filterZone === 'all' || s.zoneId === parseInt(filterZone);
    return statusMatch && zoneMatch;
  });

  const getZoneName = (zoneId: number) => {
    return zones.find((z) => z.id === zoneId)?.name || 'Unknown Zone';
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ONLINE':
        return 'var(--green)';
      case 'OFFLINE':
        return 'var(--danger)';
      case 'MAINTENANCE':
        return 'var(--warn)';
      default:
        return 'var(--text2)';
    }
  };

  const isAlertValue = (sensor: Sensor) => {
    if (sensor.type === 'GAS' && sensor.lastValue > sensor.thresholdValue) {
      return true;
    }
    if (sensor.type === 'TEMP' && sensor.lastValue > sensor.thresholdValue) {
      return true;
    }
    return false;
  };

  if (loading && sensors.length === 0) {
    return (
      <div>
        <div className="page-hd">
          <div className="page-title">Sensors Management</div>
          <div className="page-desc">Complete IoT sensors fleet management</div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text2)' }}>
          Loading sensors...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-hd">
        <div className="page-title">Sensors Management</div>
        <div className="page-desc">Complete IoT sensors fleet management</div>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 16, flexWrap: 'wrap' }}>
        <div className="filter-bar" style={{ marginBottom: 0 }}>
          {['all', 'online', 'offline', 'maintenance'].map((f) => (
            <div
              key={f}
              className={`filter-chip ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
              style={{ textTransform: 'capitalize' }}
            >
              {f}
            </div>
          ))}
        </div>

        <select
          className="fi"
          value={filterZone}
          onChange={(e) => setFilterZone(e.target.value)}
          style={{ width: 'auto', minWidth: 150 }}
        >
          <option value="all">All Zones</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>

        <button
          className="btn btn-primary"
          onClick={openCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          disabled={zones.length === 0}
        >
          <AddOutlinedIcon sx={{ fontSize: 18 }} /> Add Sensor
        </button>
      </div>

      {zones.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--warn)' }}>
          <p>⚠️ No zones available. Please create a zone first before adding sensors.</p>
        </div>
      )}

      {filteredSensors.length === 0 && zones.length > 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text2)' }}>
          <SignalCellularAltOutlinedIcon sx={{ fontSize: 48, color: 'var(--text3)', marginBottom: 2 }} />
          <p>No sensors found.</p>
        </div>
      ) : (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                <th>Status</th>
                <th>Label</th>
                <th>MAC Address</th>
                <th>Type</th>
                <th>Zone</th>
                <th>Last Value</th>
                <th>Threshold</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSensors.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="sensor-status">
                      <div
                        className="s-dot"
                        style={{
                          background: getStatusColor(s.status),
                        }}
                      />
                      <span
                        className="bd"
                        style={{
                          background:
                            s.status.toUpperCase() === 'ONLINE'
                              ? 'var(--green)20'
                              : s.status.toUpperCase() === 'OFFLINE'
                              ? 'var(--danger)20'
                              : 'var(--warn)20',
                          color: getStatusColor(s.status),
                          borderColor: getStatusColor(s.status),
                        }}
                      >
                        {s.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <strong style={{ fontSize: 13 }}>{s.label}</strong>
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)' }}>
                    {s.macAddress}
                  </td>
                  <td>
                    <span className="bd bd-blue">{s.type}</span>
                  </td>
                  <td>{getZoneName(s.zoneId)}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
                    <span
                      style={{
                        color: isAlertValue(s) ? 'var(--danger)' : 'var(--text)',
                        fontWeight: isAlertValue(s) ? 600 : 400,
                      }}
                    >
                      {s.lastValue}
                      {s.type === 'TEMP' ? '°C' : ' ppm'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)' }}>
                    {s.thresholdValue}
                    {s.type === 'TEMP' ? '°C' : ' ppm'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn btn-sm btn-blue"
                        onClick={() => openDetailModal(s)}
                        title="View details"
                      >
                        <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                      </button>
                      <button
                        className="btn btn-sm btn-cyan"
                        onClick={() => openEditModal(s)}
                        title="Edit sensor"
                      >
                        <EditOutlinedIcon sx={{ fontSize: 16 }} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => openDeleteModal(s)}
                        title="Delete sensor"
                      >
                        <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Sensor Modal */}
      {modalType === 'create' && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              <SignalCellularAltOutlinedIcon sx={{ fontSize: 20, marginRight: 1 }} /> Add Sensor
            </div>
            <div className="modal-sub">Register a new sensor in the system</div>

            <div className="fg">
              <label className="fl">Label / Name *</label>
              <input
                className="fi"
                placeholder="Ex: Living Room - MQ-2"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </div>

            <div className="fg">
              <label className="fl">MAC Address *</label>
              <input
                className="fi"
                placeholder="AA:BB:CC:DD:EE:FF"
                style={{ fontFamily: 'var(--mono)' }}
                value={formData.macAddress}
                onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
              />
            </div>

            <div className="g2">
              <div className="fg">
                <label className="fl">Sensor Type *</label>
                <select
                  className="fi"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="GAS">GAS (MQ-2)</option>
                  <option value="TEMP">TEMP/HUMIDITY (DHT22)</option>
                  <option value="FLAME">FLAME</option>
                  <option value="MOTION">MOTION</option>
                </select>
              </div>

              <div className="fg">
                <label className="fl">Zone *</label>
                <select
                  className="fi"
                  value={formData.zoneId}
                  onChange={(e) => setFormData({ ...formData, zoneId: parseInt(e.target.value) })}
                >
                  <option value="0">Select a zone</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="fg">
              <label className="fl">Alert Threshold *</label>
              <input
                className="fi"
                type="number"
                placeholder={formData.type === 'TEMP' ? '45 (°C)' : '500 (ppm)'}
                value={formData.thresholdValue}
                onChange={(e) => setFormData({ ...formData, thresholdValue: parseFloat(e.target.value) })}
              />
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateSensor} disabled={loading}>
                {loading ? 'Creating...' : '✅ Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sensor Modal */}
      {modalType === 'edit' && selectedSensor && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              <EditOutlinedIcon sx={{ fontSize: 20, marginRight: 1 }} /> Edit Sensor
            </div>
            <div className="modal-sub">Update sensor configuration</div>

            <div className="fg">
              <label className="fl">Label / Name *</label>
              <input
                className="fi"
                placeholder="Sensor name"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </div>

            <div className="fg">
              <label className="fl">MAC Address (Read-only)</label>
              <input
                className="fi"
                disabled
                style={{ fontFamily: 'var(--mono)', background: 'var(--bg2)', cursor: 'not-allowed' }}
                value={formData.macAddress}
              />
            </div>

            <div className="g2">
              <div className="fg">
                <label className="fl">Sensor Type *</label>
                <select
                  className="fi"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="GAS">GAS (MQ-2)</option>
                  <option value="TEMP">TEMP/HUMIDITY (DHT22)</option>
                  <option value="FLAME">FLAME</option>
                  <option value="MOTION">MOTION</option>
                </select>
              </div>

              <div className="fg">
                <label className="fl">Zone *</label>
                <select
                  className="fi"
                  value={formData.zoneId}
                  onChange={(e) => setFormData({ ...formData, zoneId: parseInt(e.target.value) })}
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="fg">
              <label className="fl">Alert Threshold *</label>
              <input
                className="fi"
                type="number"
                placeholder={formData.type === 'TEMP' ? '45 (°C)' : '500 (ppm)'}
                value={formData.thresholdValue}
                onChange={(e) => setFormData({ ...formData, thresholdValue: parseFloat(e.target.value) })}
              />
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdateSensor} disabled={loading}>
                {loading ? 'Saving...' : '✅ Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sensor Detail Modal */}
      {modalType === 'detail' && selectedSensor && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              <SignalCellularAltOutlinedIcon sx={{ fontSize: 20, marginRight: 1 }} /> Sensor Details
            </div>
            <div className="modal-sub">{selectedSensor.label}</div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 16,
            }}>
              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 12,
              }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>MAC Address</div>
                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 600 }}>{selectedSensor.macAddress}</div>
              </div>

              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 12,
              }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>Status</div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: getStatusColor(selectedSensor.status),
                  }}
                >
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: getStatusColor(selectedSensor.status),
                  }} />
                  {selectedSensor.status}
                </div>
              </div>

              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 12,
              }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>Type</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedSensor.type}</div>
              </div>

              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 12,
              }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>Zone</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{getZoneName(selectedSensor.zoneId)}</div>
              </div>

              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 12,
              }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>Last Value</div>
                <div style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: isAlertValue(selectedSensor) ? 'var(--danger)' : 'var(--text)',
                }}>
                  {selectedSensor.lastValue} {selectedSensor.type === 'TEMP' ? '°C' : 'ppm'}
                </div>
              </div>

              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 12,
              }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>Threshold</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedSensor.thresholdValue} {selectedSensor.type === 'TEMP' ? '°C' : 'ppm'}</div>
              </div>

              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 12,
              }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>Created</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {new Date(selectedSensor.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 12,
              }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>Last Updated</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {new Date(selectedSensor.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {isAlertValue(selectedSensor) && (
              <div style={{
                background: 'var(--danger)20',
                border: '1px solid var(--danger)',
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
                color: 'var(--danger)',
              }}>
                <p style={{ margin: 0, fontWeight: 600 }}>⚠️ Alert: Value exceeds threshold</p>
                <p style={{ margin: '4px 0 0 0', fontSize: 13 }}>
                  Current value ({selectedSensor.lastValue}) exceeds the threshold ({selectedSensor.thresholdValue})
                </p>
              </div>
            )}

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
              <button
                className="btn btn-cyan"
                onClick={() => {
                  closeModal();
                  openEditModal(selectedSensor);
                }}
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalType === 'delete' && selectedSensor && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title" style={{ color: 'var(--danger)' }}>
              ⚠️ Delete Sensor
            </div>
            <div className="modal-sub">Are you sure you want to delete this sensor?</div>

            <div style={{
              background: 'var(--danger)20',
              border: '1px solid var(--danger)',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              color: 'var(--danger)',
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>{selectedSensor.label}</p>
              <p style={{ margin: 0, fontSize: 13, fontFamily: 'var(--mono)' }}>{selectedSensor.macAddress}</p>
              <p style={{ margin: '8px 0 0 0', fontSize: 12 }}>This action cannot be undone.</p>
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteSensor}
                disabled={loading}
              >
                {loading ? 'Deleting...' : '🗑️ Delete Sensor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
