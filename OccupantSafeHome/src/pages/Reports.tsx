import AlertBox from '../components/AlertBox'
import StackedLineChartOutlinedIcon from '@mui/icons-material/StackedLineChartOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined'

function Reports() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Alerts Management</div>
        <div className="page-desc">Complete history and management of active alerts</div>
      </div>

      <div className="tabs section-gap">
        <div className="tab active">All</div>
        <div className="tab">Active</div>
        <div className="tab">Resolved</div>
      </div>

      

      <div className="grid-3 section-gap">
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <StackedLineChartOutlinedIcon sx={{ fontSize: 18, marginRight: 0.5 }} /> Daily Report
            </span>
          </div>
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ color: 'var(--text2)' }}>Date</span>
              <span>{new Date().toLocaleDateString('en-US')}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ color: 'var(--text2)' }}>Status</span>
              <span className="badge badge-green">Ready</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
              }}
            >
              <span style={{ color: 'var(--text2)' }}>Events</span>
              <span style={{ fontFamily: 'var(--mono)' }}>42</span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-sm btn-primary" style={{ flex: 1 }}>
                <FileDownloadOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Download
              </button>
              <button className="btn btn-sm btn-secondary" style={{ flex: 1 }}>
                <VisibilityOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> View
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <StackedLineChartOutlinedIcon sx={{ fontSize: 18, marginRight: 0.5 }} /> Weekly Report
            </span>
          </div>
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ color: 'var(--text2)' }}>Week of</span>
              <span>{new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US')}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ color: 'var(--text2)' }}>Status</span>
              <span className="badge badge-green">Ready</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
              }}
            >
              <span style={{ color: 'var(--text2)' }}>Events</span>
              <span style={{ fontFamily: 'var(--mono)' }}>287</span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-sm btn-primary" style={{ flex: 1 }}>
                <FileDownloadOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Download
              </button>
              <button className="btn btn-sm btn-secondary" style={{ flex: 1 }}>
                <VisibilityOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> View
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <StackedLineChartOutlinedIcon sx={{ fontSize: 18, marginRight: 0.5 }} /> Monthly Report
            </span>
          </div>
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ color: 'var(--text2)' }}>Month</span>
              <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ color: 'var(--text2)' }}>Status</span>
              <span className="badge badge-green">Ready</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
              }}
            >
              <span style={{ color: 'var(--text2)' }}>Events</span>
              <span style={{ fontFamily: 'var(--mono)' }}>1,256</span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-sm btn-primary" style={{ flex: 1 }}>
                <FileDownloadOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Download
              </button>
              <button className="btn btn-sm btn-secondary" style={{ flex: 1 }}>
                <VisibilityOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> View
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card section-gap">
        <div className="card-header">
          <span className="card-title">Alert Statistics</span>
        </div>
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span style={{ color: 'var(--text2)' }}>Smoke Alerts</span>
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>156</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span style={{ color: 'var(--text2)' }}>Gas Alerts</span>
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>89</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span style={{ color: 'var(--text2)' }}>Temperature Alerts</span>
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>34</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
            }}
          >
            <span style={{ color: 'var(--text2)' }}>Total Alerts</span>
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--danger)' }}>
              279
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary">
          <SettingsOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Configure Reports
        </button>
        <button className="btn btn-primary">
          <RefreshOutlinedIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Generate Reports
        </button>
      </div>
    </div>
  )
}

export default Reports
