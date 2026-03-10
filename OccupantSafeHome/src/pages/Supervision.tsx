import { useState } from 'react'

import WeekendIcon from '@mui/icons-material/Weekend'
import KitchenIcon from '@mui/icons-material/Kitchen'
import BedIcon from '@mui/icons-material/Bed'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import ParkIcon from '@mui/icons-material/Park'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ErrorIcon from '@mui/icons-material/Error'

import ThermostatIcon from '@mui/icons-material/Thermostat'
import AirIcon from '@mui/icons-material/Air'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import SensorsIcon from '@mui/icons-material/Sensors'

import BarChartIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

interface Zone {
  id: number
  name: string
  status: 'ok' | 'warn' | 'danger'
  temp: number
  gas: number
  smoke: number
  sensors: number
  online: number
}

interface SupervisionProps {
  zones?: Zone[]
}

function Supervision({ zones = [] }: SupervisionProps) {
  const [selected, setSelected] = useState<Zone | null>(null)

  const defaultZones: Zone[] = [
    { id: 1, name: 'Salon', status: 'ok', temp: 23.4, gas: 42, smoke: 0.8, sensors: 3, online: 3 },
    { id: 2, name: 'Cuisine', status: 'warn', temp: 31.2, gas: 180, smoke: 3.1, sensors: 2, online: 2 },
    { id: 3, name: 'Chambre', status: 'ok', temp: 22.1, gas: 35, smoke: 0.3, sensors: 2, online: 2 },
    { id: 4, name: 'Garage', status: 'danger', temp: 28.5, gas: 650, smoke: 12.4, sensors: 2, online: 1 },
    { id: 5, name: 'Jardin', status: 'ok', temp: 19.8, gas: 30, smoke: 0.1, sensors: 1, online: 1 },
  ]

  const displayZones = zones.length > 0 ? zones : defaultZones

  const getZoneIcon = (name: string) => {
    switch (name) {
      case 'Salon':
        return <WeekendIcon fontSize="large"  style={{ color: '#6366f1' }}/>
      case 'Cuisine':
        return <KitchenIcon fontSize="large" style={{ color: '#f97316' }} />
      case 'Chambre':
        return <BedIcon fontSize="large" style={{ color: '#8b5cf6' }}  />
      case 'Garage':
        return <DirectionsCarIcon fontSize="large"  style={{ color: '#6b7280' }}/>
      default:
        return <ParkIcon fontSize="large" style={{ color: '#22c55e' }} />
    }
  }

  const renderStatus = (status: Zone['status']) => {
    switch (status) {
      case 'ok':
        return (
          <>
            <CheckCircleIcon fontSize="small" style={{ color: '#22c55e' }}  /> Normal
          </>
        )
      case 'warn':
        return (
          <>
            <WarningAmberIcon fontSize="small" style={{ color: '#f59e0b' }} /> Attention
          </>
        )
      default:
        return (
          <>
            <ErrorIcon fontSize="small" style={{ color: '#ef4444' }}  /> Critique
          </>
        )
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Supervision en Temps Réel</div>
        <div className="page-desc">
          Surveillez chaque zone et capteur de votre maison
        </div>
      </div>

      <div className="zone-grid section-gap">
        {displayZones.map(z => (
          <div
            className={`zone-card ${z.status}`}
            key={z.id}
            onClick={() => setSelected(z)}
          >
            <div style={{ marginBottom: 8 }}>{getZoneIcon(z.name)}</div>

            <div className="zone-name">{z.name}</div>

            <span
              className={`zone-status-badge ${z.status}`}
              style={{ marginTop: 4, display: 'flex', gap: 4, alignItems: 'center' }}
            >
              {renderStatus(z.status)}
            </span>

            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: 'var(--text2)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Cliquer pour détails <ArrowForwardIcon fontSize="small" />
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
            style={{ width: 500 }}
          >
            <div
              className="modal-title"
              style={{ display: 'flex', gap: 8, alignItems: 'center' }}
            >
              {getZoneIcon(selected.name)} {selected.name}
            </div>

            <div className="modal-sub">
              Détail des capteurs en temps réel
            </div>

            {/* Température */}
            <div style={{ marginBottom: 16 }}>
              <div className="sensor-bar-wrap">
                <div className="sensor-bar-label">
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <ThermostatIcon fontSize="small" style={{ color: '#38bdf8' }} /> Température
                  </span>
                  <span>{selected.temp}°C</span>
                </div>

                <div className="sensor-bar">
                  <div
                    className="sensor-bar-fill ok"
                    style={{
                      width: `${Math.min((selected.temp / 50) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Gaz */}
            <div style={{ marginBottom: 16 }}>
              <div className="sensor-bar-wrap">
                <div className="sensor-bar-label">
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <AirIcon fontSize="small" style={{ color: '#a3e635' }} /> Gaz inflammable
                  </span>

                  <span
                    style={{
                      color:
                        selected.gas > 500
                          ? 'var(--danger)'
                          : selected.gas > 100
                          ? 'var(--warn)'
                          : 'var(--text)',
                    }}
                  >
                    {selected.gas} ppm
                  </span>
                </div>

                <div className="sensor-bar">
                  <div
                    className={`sensor-bar-fill ${
                      selected.gas > 500
                        ? 'danger'
                        : selected.gas > 100
                        ? 'warn'
                        : 'ok'
                    }`}
                    style={{
                      width: `${Math.min((selected.gas / 1000) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Fumée */}
            <div style={{ marginBottom: 20 }}>
              <div className="sensor-bar-wrap">
                <div className="sensor-bar-label">
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <LocalFireDepartmentIcon fontSize="small" style={{ color: '#ef4444' }}  /> Fumée
                  </span>

                  <span
                    style={{
                      color:
                        selected.smoke > 5
                          ? 'var(--danger)'
                          : selected.smoke > 2
                          ? 'var(--warn)'
                          : 'var(--text)',
                    }}
                  >
                    {selected.smoke} ppm
                  </span>
                </div>

                <div className="sensor-bar">
                  <div
                    className={`sensor-bar-fill ${
                      selected.smoke > 5
                        ? 'danger'
                        : selected.smoke > 2
                        ? 'warn'
                        : 'ok'
                    }`}
                    style={{
                      width: `${Math.min((selected.smoke / 20) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Info capteurs */}
            <div
              style={{
                background: 'var(--bg3)',
                borderRadius: 8,
                padding: 12,
                fontSize: 12,
                color: 'var(--text2)',
                fontFamily: 'var(--mono)',
                marginBottom: 16,
                display: 'flex',
                gap: 6,
                alignItems: 'center',
              }}
            >
              <SensorsIcon fontSize="small" />
              {selected.online}/{selected.sensors} capteurs en ligne •
              Dernière mise à jour: il y a 2s
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }}>
                <BarChartIcon fontSize="small" /> Voir l'historique
              </button>

              <button className="btn btn-primary" style={{ flex: 1 }}>
                <SettingsIcon fontSize="small" /> Configurer
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setSelected(null)}
              >
                <CloseIcon fontSize="small" /> Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Supervision
