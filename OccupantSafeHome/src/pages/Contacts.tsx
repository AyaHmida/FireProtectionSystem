import { useState } from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
interface Contact {
  id: number
  name: string
  relation: string
  phone: string
  emoji: string
  isEmergency?: boolean
}

function Contacts() {
  const [contacts] = useState<Contact[]>([
    {
      id: 1,
      name: 'SAMU',
      relation: 'Services d\'urgence',
      phone: '15',
      emoji: '🚑',
      isEmergency: true,
    },
    {
      id: 2,
      name: 'Pompiers',
      relation: 'Services d\'urgence',
      phone: '18',
      emoji: '🚒',
      isEmergency: true,
    },
    {
      id: 3,
      name: 'Police',
      relation: 'Services d\'urgence',
      phone: '17',
      emoji: '🚔',
      isEmergency: true,
    },
    {
      id: 4,
      name: 'Dr. Marie Dupont',
      relation: 'Médecin',
      phone: '+33612345678',
      emoji: '👩‍⚕️',
    },
    
    {
      id: 6,
      name: 'Sophie Laurent',
      relation: 'Sœur',
      phone: '+33678901234',
      emoji: '👩',
    },
    {
      id: 7,
      name: 'Pierre Gérard',
      relation: 'Voisin',
      phone: '+33612123456',
      emoji: '👳',
    },
  ])
  const [showAddModal, setShowAddModal] = useState(false)

  const testContact = (contact: Contact) => {
    alert(
      `📞 Appel de test au ${contact.name}\n\nNuméro: ${contact.phone}\n\n(Mode bac à sable - pas d'appel réel)`
    )
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Contacts d'Urgence</div>
        <div className="page-desc">Gestion des numéros d'urgence et contacts préenregistrés</div>
      </div>

      <div className="card section-gap">
        <div className="card-header">
          <span className="card-title">Points de Contact Critiques</span>
          <button className="btn btn-primary btn-small" onClick={() => setShowAddModal(true)}>
            <AddOutlinedIcon 
  style={{ 
    fontSize: 20,  
    color: '#3b82f6', 
    marginRight: 4  
  }} 
/>
 Ajouter
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 12,
          }}
        >
          {contacts.map(contact => (
            <div
              key={contact.id}
              style={{
                background:
                  contact.isEmergency || contact.relation.includes('urgence')
                    ? 'rgba(239, 68, 68, .08)'
                    : 'rgba(96, 165, 250, .08)',
                border:
                  contact.isEmergency || contact.relation.includes('urgence')
                    ? '1px solid rgba(239, 68, 68, .2)'
                    : '1px solid rgba(96, 165, 250, .2)',
                borderRadius: 10,
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', gap: 10, marginBottom: 12 }}>
                <div
                  style={{
                    fontSize: 32,
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `rgba(96, 165, 250, ${contact.isEmergency ? 0.3 : 0.15})`,
                  }}
                >
                  {contact.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{contact.name}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--text2)',
                      marginTop: 1,
                    }}
                  >
                    {contact.relation}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--surface)',
                  borderRadius: 6,
                  padding: '10px 12px',
                  marginBottom: 12,
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--accent)',
                }}
              >
                {contact.phone}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => testContact(contact)}
                  style={{ flex: 1 }}
                >
                  📞 Test
                </button>
                <button className="btn btn-danger btn-small">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

     <div className="card section-gap">
  <div className="card-header">
    <span className="card-title">
      <LightbulbOutlinedIcon style={{ fontSize: 20, color: '#facc15', marginRight: 6 }} />
      Conseil de Sécurité
    </span>
  </div>
  <div style={{ display: 'flex', gap: 12, alignItems: 'start' }}>
    <CheckCircleOutlineIcon style={{ fontSize: 20, color: '#10b981', marginTop: 2 }} />
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
        Gardez ces numéros à jour
      </div>
      <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: '1.5' }}>
        Assurez-vous que tous les numéros d'urgence sont correctement enregistrés et testés
        régulièrement. En cas d'alerte critique, le système contactera ces numéros
        automatiquement.
      </div>
    </div>
  </div>
</div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">➕ Ajouter un Contact</div>
            <div className="modal-sub">Créer un nouveau contact d'urgence</div>

            <div className="form-group">
              <label className="form-label">Nom complet</label>
              <input placeholder="Nom du contact" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Relation</label>
              <select className="form-input form-select">
                <option>Épouse</option>
                <option>Époux</option>
                <option>Frère</option>
                <option>Sœur</option>
                <option>Enfant</option>
                <option>Parent</option>
                <option>Ami</option>
                <option>Voisin</option>
                <option>Médecin</option>
                <option>Autre</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Numéro de téléphone</label>
              <input placeholder="+33 6 12 34 56 78" className="form-input" type="tel" />
            </div>

            

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={() => setShowAddModal(false)}>
                 Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Contacts
