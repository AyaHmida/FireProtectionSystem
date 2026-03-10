import { useState } from 'react'

import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined'
import BatteryChargingFullOutlinedIcon from '@mui/icons-material/BatteryChargingFullOutlined'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'

interface Device {
  id: number
  name: string
  type: string
  status: 'online' | 'offline'
  location: string
  battery?: number
}

function Devices() {
  const [devices, setDevices] = useState<Device[]>([
    { id: 1, name: 'Living Room Sensor', type: 'Temperature Sensor', status: 'online', location: 'Living Room', battery: 85 },
    { id: 2, name: 'Kitchen Sensor', type: 'Gas Sensor', status: 'online', location: 'Kitchen', battery: 92 },
    { id: 3, name: 'Garage Smoke Sensor', type: 'Smoke Sensor', status: 'online', location: 'Garage', battery: 100 },
    { id: 4, name: 'Bedroom Sensor', type: 'Temperature Sensor', status: 'offline', location: 'Bedroom', battery: 15 },
    { id: 5, name: 'Garden Sensor', type: 'Gas Sensor', status: 'online', location: 'Garden', battery: 78 },
    { id: 6, name: 'Entrance Camera', type: 'IP Camera', status: 'online', location: 'Entrance', battery: 88 },
  ])

  const handleToggle = (id: number) => {
    setDevices(devices.map(device =>
      device.id === id
        ? { ...device, status: device.status === 'online' ? 'offline' : 'online' }
        : device
    ))
  }

  const onlineCount = devices.filter(d => d.status === 'online').length
  const offlineCount = devices.filter(d => d.status === 'offline').length

  const getBatteryColor = (level?: number) => {
    if (level === undefined) return 'var(--text2)'
    if (level < 20) return 'var(--danger)'
    if (level < 50) return 'var(--warn)'
    return 'var(--success)'
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Connected Devices</div>
        <div className="page-desc">Monitor and manage all your sensors and devices</div>
      </div>

      <div className="grid-2 section-gap">
        {/* Summary */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Device Summary</span>
          </div>

          <div style={{ marginTop: 16 }}>
            <SummaryRow label="Total Devices" value={devices.length} />
            <SummaryRow label="Online" value={onlineCount} color="var(--success)" />
            <SummaryRow label="Offline" value={offlineCount} color="var(--danger)" />
          </div>
        </div>

        {/* System status */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">System Status</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 16,
              padding: 12,
              background: 'rgba(34,197,94,.12)',
              borderRadius: 8,
              border: '1px solid rgba(34,197,94,.3)',
            }}
          >
            <CheckCircleIcon style={{ fontSize: 28, color: 'var(--success)' }} />

            <div>
              <div style={{ fontWeight: 600, color: 'var(--success)' }}>
                System Operational
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                All sensors are functioning properly
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offline warning */}
      {offlineCount > 0 && (
        <div
          style={{
            background: 'rgba(127,29,29,.92)',
            borderRadius: 10,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
            color: '#fff',
            fontWeight: 600,
          }}
        >
          <WarningAmberIcon style={{ fontSize: 26, color: '#fbbf24' }} />
          <div>
            <strong>{offlineCount} device(s) offline</strong> — Check connections
          </div>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-secondary">
          <RefreshOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
          Refresh
        </button>

        <button className="btn btn-primary">
          <AddOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
          Add Device
        </button>
      </div>

      {/* Device list */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Devices</span>
        </div>

        {devices.map(device => (
          <div
            key={device.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 14,
              marginBottom: 8,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <SignalCellularAltOutlinedIcon
                style={{
                  fontSize: 24,
                  color: device.status === 'online'
                    ? 'var(--success)'
                    : 'var(--danger)',
                }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{device.name}</div>

                <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
                  {device.type} • {device.location}
                </div>

                {device.battery !== undefined && (
                  <div
                    style={{
                      fontSize: 11,
                      marginTop: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: getBatteryColor(device.battery),
                    }}
                  >
                    <BatteryChargingFullOutlinedIcon sx={{ fontSize: 14 }} />
                    {device.battery}%
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <RadioButtonCheckedIcon
                  style={{
                    fontSize: 14,
                    color: device.status === 'online'
                      ? 'var(--success)'
                      : 'var(--danger)',
                  }}
                />
                {device.status}
              </div>

              <button
                className="btn btn-sm btn-secondary"
                onClick={() => handleToggle(device.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {device.status === 'online'
                  ? <ToggleOnIcon style={{ color: 'var(--success)' }} />
                  : <ToggleOffIcon style={{ color: 'var(--danger)' }} />
                }
                Toggle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Small helper component */
function SummaryRow({
  label,
  value,
  color = 'var(--text)',
}: {
  label: string
  value: number
  color?: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span style={{ color: 'var(--text2)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color }}>
        {value}
      </span>
    </div>
  )
}

export default Devices
