import React, { useState } from 'react';

export const MaintenancePage: React.FC = () => {
  const [maintMode, setMaintMode] = useState(false);

  return (
    <div>
      <div className="page-hd">
        <div className="page-title">Maintenance & Statistiques</div>
        <div className="page-desc">Mode maintenance global et analyse des performances</div>
      </div>

      <div className="maint-card" style={{ marginBottom: 16 }}>
        <div className="maint-toggle">
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>🔧 Mode Maintenance Global</div>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>
              Désactive toutes les alertes système et notifie automatiquement les utilisateurs
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label className="toggle">
              <input type="checkbox" checked={maintMode} onChange={(e) => setMaintMode(e.target.checked)} />
              <div className="ttr" />
              <div className="ttb" />
            </label>
            <span className={`bd ${maintMode ? 'bd-warn' : 'bd-gray'}`}>{maintMode ? 'ACTIF' : 'INACTIF'}</span>
          </div>
        </div>
        {maintMode && (
          <div style={{ marginTop: 14, padding: 12, background: 'rgba(245,158,11,.08)', borderRadius: 8, fontSize: 12, color: 'var(--warn)', fontFamily: 'var(--mono)' }}>
            ⚠️ Mode maintenance actif — Toutes les alertes sont suspendues. Les utilisateurs ont été notifiés.
          </div>
        )}
      </div>

      <div className="g3" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-hd">
            <span className="card-ttl">Uptime</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--green)' }}>99.97%</div>
          <div className="prog-bar">
            <div className="prog-fill" style={{ width: '99.97%', background: 'var(--green)' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 8, fontFamily: 'var(--mono)' }}>Objectif: &gt;99%</div>
        </div>

        <div className="card">
          <div className="card-hd">
            <span className="card-ttl">Alertes (30j)</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--accent2)' }}>47</div>
          <div className="prog-bar">
            <div className="prog-fill" style={{ width: '60%', background: 'var(--accent2)' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 8, fontFamily: 'var(--mono)' }}>38 résolues / 9 actives</div>
        </div>

        <div className="card">
          <div className="card-hd">
            <span className="card-ttl">Temps détection moy.</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--accent)' }}>1.8s</div>
          <div className="prog-bar">
            <div className="prog-fill" style={{ width: '60%', background: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 8, fontFamily: 'var(--mono)' }}>Seuil requis: &lt;3s ✓</div>
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-hd">
            <span className="card-ttl">Alertes par zone (30j)</span>
          </div>
          {[
            ['Garage', '65%', 'danger'],
            ['Cuisine', '48%', 'warn'],
            ['Salon', '15%', 'blue'],
            ['Chambre', '8%', 'green'],
            ['Jardin', '5%', 'green'],
          ].map(([z, p, c]) => (
            <div key={z} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>{z}</span>
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{p}</span>
              </div>
              <div className="prog-bar" style={{ height: 6 }}>
                <div
                  className="prog-fill"
                  style={{
                    width: p,
                    background: `var(--${c === 'danger' ? 'danger' : c === 'warn' ? 'warn' : c === 'blue' ? 'accent2' : 'green'})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-hd">
            <span className="card-ttl">Actions rapides</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-cyan" style={{ justifyContent: 'flex-start' }}>
              🔄 Redémarrer les services
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              💾 Sauvegarde base de données
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              🧹 Vider le cache système
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              📊 Générer rapport mensuel
            </button>
            <button className="btn btn-danger" style={{ justifyContent: 'flex-start' }}>
              ⚠️ Purger les logs anciens (&gt;90j)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
