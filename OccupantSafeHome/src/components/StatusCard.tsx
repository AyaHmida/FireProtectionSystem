interface StatusCardProps {
  title: string
  value: string | number
  icon: string
  status: 'active' | 'inactive' | 'warning'
}

function StatusCard({ title, value, icon, status }: StatusCardProps) {
  const statusClassName = `status-${status}`
  
  return (
    <div className="card">
      <div style={{ fontSize: '2em', marginBottom: '10px' }}>{icon}</div>
      <h3>{title}</h3>
      <div style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '10px' }}>
        {value}
      </div>
      <span className={`status-badge ${statusClassName}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  )
}

export default StatusCard
