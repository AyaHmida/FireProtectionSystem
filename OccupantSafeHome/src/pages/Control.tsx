import { useState } from 'react'
import AlarmOnRoundedIcon from '@mui/icons-material/AlarmOnRounded'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'
import TimerIcon from '@mui/icons-material/Timer'
import WeekendIcon from '@mui/icons-material/Weekend'
import KitchenIcon from '@mui/icons-material/Kitchen'
import HotelIcon from '@mui/icons-material/Hotel'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import GrassIcon from '@mui/icons-material/Grass'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

interface Zone {
  id: number
  name: string
  sensors: number
}

interface ControlProps {
  zones?: Zone[]
}

function Control({ zones = [] }: ControlProps) {
  const [globalOn, setGlobalOn] = useState(true)
  const [timerModal, setTimerModal] = useState(false)
  const [alarmActive, setAlarmActive] = useState(true)
  const [zoneStates, setZoneStates] = useState({ 1: true, 2: true, 3: true, 4: true, 5: true })

  const defaultZones: Zone[] = [
    { id: 1, name: 'Salon', sensors: 3 },
    { id: 2, name: 'Cuisine', sensors: 2 },
    { id: 3, name: 'Chambre', sensors: 2 },
    { id: 4, name: 'Garage', sensors: 2 },
    { id: 5, name: 'Jardin', sensors: 1 },
  ]

  const displayZones = zones.length > 0 ? zones : defaultZones

  const getZoneIcon = (name: string) => {
    switch (name) {
      case 'Salon':
        return <WeekendIcon style={{ color: '#3b82f6', fontSize: 28 }} />
      case 'Cuisine':
        return <KitchenIcon style={{ color: '#f97316', fontSize: 28 }} />
      case 'Chambre':
        return <HotelIcon style={{ color: '#8b5cf6', fontSize: 28 }} />
      case 'Garage':
        return <DirectionsCarIcon style={{ color: '#ef4444', fontSize: 28 }} />
      default:
        return <GrassIcon style={{ color: '#22c55e', fontSize: 28 }} />
    }
  }

  const toggleZone = (id: number) => {
    setZoneStates(s => ({ ...s, [id]: !s[id as keyof typeof s] }))
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Contrôle du Système</div>
        <div className="page-desc">Activez, désactivez ou planifiez votre système de surveillance</div>
      </div>

      {alarmActive && (
        <div
          style={{
            background: 'rgba(153, 27, 27, 0.95)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
            color: '#fff',
            boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <AlarmOnRoundedIcon style={{ fontSize: 40, color: '#ef4444' }} />

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>ALARM ACTIVE — Garage</div>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>
              Détection de fumée critique • Déclenchée il y a 5 min
            </div>
          </div>

          <button className="btn btn-light btn-lg" onClick={() => setAlarmActive(false)}>
            <NotificationsOffIcon style={{ marginRight: 6, color: '#ef4444' }} />
            STOP ALARME
          </button>
        </div>
      )}

      <div className="card section-gap">
        <div className="card-header">
          <span className="card-title">Surveillance Globale</span>
          <span className={`badge ${globalOn ? 'badge-green' : 'badge-gray'}`}>
            {globalOn ? 'ACTIVE' : 'DÉSACTIVÉE'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Activer / Désactiver la surveillance</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>Contrôle global de tout le système</div>
          </div>
          <div className="toggle-wrap">
            <label className="toggle">
              <input type="checkbox" checked={globalOn} onChange={e => setGlobalOn(e.target.checked)} />
              <div className="toggle-track" />
              <div className="toggle-thumb" />
            </label>
            <span className="toggle-label" style={{ color: globalOn ? 'var(--accent)' : 'var(--text2)' }}>
              {globalOn ? 'Activé' : 'Désactivé'}
            </span>
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setTimerModal(true)}>
            <TimerIcon style={{ fontSize: 18, marginRight: 6, color: '#fbbf24' }} />
            Désactivation temporaire
          </button>
        </div>
      </div>

      <div className="card section-gap">
        <div className="card-header">
          <span className="card-title">Contrôle par Zone</span>
        </div>
        {displayZones.map(z => (
          <div
            key={z.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {getZoneIcon(z.name)}
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{z.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
                  {z.sensors} capteurs
                </div>
              </div>
            </div>
            <div className="toggle-wrap">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={zoneStates[z.id as keyof typeof zoneStates] || false}
                  onChange={() => toggleZone(z.id)}
                />
                <div className="toggle-track" />
                <div className="toggle-thumb" />
              </label>
              <span
                className={`badge ${zoneStates[z.id as keyof typeof zoneStates] ? 'badge-green' : 'badge-gray'}`}
              >
                {zoneStates[z.id as keyof typeof zoneStates] ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {timerModal && (
        <div className="modal-overlay" onClick={() => setTimerModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              <TimerIcon style={{ fontSize: 18, marginRight: 6, color: '#fbbf24' }} />
              Désactivation Temporaire
            </div>
            <div className="modal-sub">Le système se réactivera automatiquement</div>
            <div className="form-group">
              <label className="form-label">Durée</label>
              <select className="form-input form-select">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 heure</option>
                <option>2 heures</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Raison (obligatoire)</label>
              <input className="form-input" placeholder="Ex: Cuisine, Travaux, Test..." />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setTimerModal(false)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={() => setTimerModal(false)}>
                <CheckCircleIcon style={{ fontSize: 16, marginRight: 4, color: '#22c55e' }} />
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Control
