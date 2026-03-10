interface AlertBoxProps {
  type: 'info' | 'success' | 'danger'
  title?: string
  message: string
}

function AlertBox({ type, title, message }: AlertBoxProps) {
  return (
    <div className={`alert alert-${type}`}>
      {title && <strong>{title}</strong>}
      {title && <br />}
      <span>{message}</span>
    </div>
  )
}

export default AlertBox
