import { useState } from 'react'

function Settings() {
  const [tempWarn, setTempWarn] = useState(30)
  const [tempCrit, setTempCrit] = useState(45)
  const [gasWarn, setGasWarn] = useState(150)
  const [gasCrit, setGasCrit] = useState(500)

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Configuration des Seuils</div>
        <div className="page-desc">
          Personnalisez les seuils de détection par type de capteur
        </div>
      </div>

      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-header">
            <span className="card-title">🌡️ Température (°C)</span>
          </div>
          <div className="slider-wrap">
            <div className="slider-row">
              <span style={{ color: 'var(--warn)' }}>⚠ Seuil Pré-alerte</span>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--warn)' }}>
                {tempWarn}°C
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={50}
              value={tempWarn}
              onChange={e => setTempWarn(+e.target.value)}
            />
          </div>
          <div className="slider-wrap" style={{ marginTop: 16 }}>
            <div className="slider-row">
              <span style={{ color: 'var(--danger)' }}>🔴 Seuil Critique</span>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--danger)' }}>
                {tempCrit}°C
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={80}
              value={tempCrit}
              onChange={e => setTempCrit(+e.target.value)}
            />
          </div>
          <div
            style={{
              marginTop: 12,
              padding: 10,
              background: 'var(--bg3)',
              borderRadius: 8,
              fontSize: 11,
              color: 'var(--text2)',
              fontFamily: 'var(--mono)',
            }}
          >
            ✓ Pré-alerte ({tempWarn}°C) &lt; Critique ({tempCrit}°C)
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">💨 Gaz (ppm)</span>
          </div>
          <div className="slider-wrap">
            <div className="slider-row">
              <span style={{ color: 'var(--warn)' }}>⚠ Seuil Pré-alerte</span>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--warn)' }}>
                {gasWarn} ppm
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={400}
              value={gasWarn}
              onChange={e => setGasWarn(+e.target.value)}
            />
          </div>
          <div className="slider-wrap" style={{ marginTop: 16 }}>
            <div className="slider-row">
              <span style={{ color: 'var(--danger)' }}>🔴 Seuil Critique</span>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--danger)' }}>
                {gasCrit} ppm
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={1000}
              value={gasCrit}
              onChange={e => setGasCrit(+e.target.value)}
            />
          </div>
          <div
            style={{
              marginTop: 12,
              padding: 10,
              background: 'var(--bg3)',
              borderRadius: 8,
              fontSize: 11,
              color: 'var(--text2)',
              fontFamily: 'var(--mono)',
            }}
          >
            ✓ Pré-alerte ({gasWarn} ppm) &lt; Critique ({gasCrit} ppm)
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button className="btn btn-secondary">↺ Réinitialiser</button>
        <button className="btn btn-primary">💾 Enregistrer les seuils</button>
      </div>
    </div>
  )
}

export default Settings
