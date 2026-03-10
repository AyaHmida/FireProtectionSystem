interface DeviceCardProps {
  name: string
  type: string
  status: 'online' | 'offline'
  location: string
  battery?: number
  onToggle?: () => void
}

function DeviceCard({ name, type, status, location, battery, onToggle }: DeviceCardProps) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <div style={{ marginBottom: '15px' }}>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Location:</strong> {location}</p>
        {battery !== undefined && (
          <p><strong>Battery:</strong> {battery}%</p>
        )}
      </div>
      <div style={{ marginBottom: '15px' }}>
        <span className={`status-badge ${status === 'online' ? 'status-active' : 'status-inactive'}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      {onToggle && (
        <button className="btn btn-small btn-primary" onClick={onToggle}>
          Toggle Device
        </button>
      )}
    </div>
  )
}

export default DeviceCard
