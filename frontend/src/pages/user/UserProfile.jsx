import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../services/api.js'

export default function UserProfile() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState(user?.name || 'User')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('+1 (555) 012-3456')
  const [alerts, setAlerts] = useState(true)
  const [digest, setDigest] = useState(false)
  const [twoFA, setTwoFA] = useState(true)

  // Card state
  const [cards, setCards] = useState([])
  const [showAddCard, setShowAddCard] = useState(false)
  const [cardForm, setCardForm] = useState({ cardNumber: '', cardType: 'VISA', expiryDate: '', balance: '' })
  const [cardLoading, setCardLoading] = useState(false)
  const [cardError, setCardError] = useState('')

  useEffect(() => {
    // Fetch user cards - handle gracefully if endpoint doesn't exist
    api.get('/cards')
      .then(r => setCards(r.data))
      .catch(err => {
        // If endpoint doesn't exist (404), show empty state
        if (err.response?.status === 404) {
          console.log('Card management endpoints not yet implemented');
        }
        setCards([]);
      })
  }, [])

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  async function addCard(e) {
    e.preventDefault()
    setCardError('')
    setCardLoading(true)
    try {
      const res = await api.post('/cards', {
        cardNumber: cardForm.cardNumber.replace(/\s/g, ''),
        cardType: cardForm.cardType,
        expiryDate: cardForm.expiryDate,
        balance: parseFloat(cardForm.balance)
      })
      setCards(prev => [...prev, res.data])
      setCardForm({ cardNumber: '', cardType: 'VISA', expiryDate: '', balance: '' })
      setShowAddCard(false)
    } catch (err) {
      // Handle 404 gracefully - endpoint not implemented yet
      if (err.response?.status === 404) {
        setCardError('Card management feature is not yet available. Coming soon!')
      } else {
        setCardError(err.response?.data?.message || 'Failed to add card')
      }
    } finally {
      setCardLoading(false)
    }
  }

  async function deleteCard(cardId) {
    try {
      await api.delete(`/cards/${cardId}`)
      setCards(prev => prev.filter(c => c.id !== cardId))
    } catch (err) {
      // Handle 404 gracefully
      if (err.response?.status === 404) {
        console.log('Card delete endpoint not yet available');
      }
    }
  }

  const inputEl = (value, onChange, placeholder, type = 'text') => (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', padding: '10px 14px', background: 'rgba(8,13,26,0.85)', border: '1px solid rgba(148,163,184,0.10)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }}
      onFocus={e => (e.target.style.borderColor = 'rgba(56,189,248,0.4)')}
      onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.10)')}
    />
  )

  const labelEl = text => (
    <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>{text}</div>
  )

  function Toggle({ on, set: setVal, title, desc }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid rgba(148,163,184,0.06)' }}>
        <div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>{title}</div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginTop: 2 }}>{desc}</div>
        </div>
        <button onClick={() => setVal(!on)} style={{ width: 44, height: 24, borderRadius: 12, background: on ? '#38bdf8' : 'rgba(148,163,184,0.15)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
          <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 680 }}>
      <div>
        <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>My Profile</h1>
        <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Manage your personal information and security settings</p>
      </div>

      {/* Avatar */}
      <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: '28px', display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a5f 0%, #38bdf8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Instrument Sans', fontSize: 24, fontWeight: 700, color: '#fff' }}>
            {name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </span>
        </div>
        <div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>{name}</div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', marginTop: 2 }}>Customer Account</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {[['Status', 'Active']].map(([k, v]) => (
              <span key={k} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8', background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 3, padding: '3px 8px' }}>{k}: {v}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 24 }}>
        <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 20 }}>Personal Information</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>{labelEl('Full Name')}{inputEl(name, setName)}</div>
          <div>{labelEl('Email Address')}{inputEl(email, setEmail)}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>{labelEl('Phone Number')}{inputEl(phone, setPhone)}</div>
          <div>
            {labelEl('Currency Preference')}
            <select style={{ width: '100%', padding: '10px 14px', background: 'rgba(8,13,26,0.85)', border: '1px solid rgba(148,163,184,0.10)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, color: '#e2e8f0', outline: 'none', appearance: 'none' }}>
              <option>DT — Tunisian Dinar</option>
              <option>USD — US Dollar</option>
              <option>EUR — Euro</option>
              <option>GBP — British Pound</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Cards */}
      <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Payment Cards</div>
          <button
            onClick={() => setShowAddCard(!showAddCard)}
            style={{ fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#38bdf8', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 4, padding: '6px 14px', cursor: 'pointer' }}
          >
            {showAddCard ? '✕ Cancel' : '+ Add Card'}
          </button>
        </div>

        {/* Add card form */}
        {showAddCard && (
          <form onSubmit={addCard} style={{ background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.12)', borderRadius: 8, padding: 20, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>Add New Card</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                {labelEl('Card Number')}
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardForm.cardNumber}
                  maxLength={19}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, '').slice(0, 16)
                    v = v.replace(/(.{4})/g, '$1 ').trim()
                    setCardForm(f => ({ ...f, cardNumber: v }))
                  }}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(8,13,26,0.85)', border: '1px solid rgba(148,163,184,0.10)', borderRadius: 4, fontFamily: 'JetBrains Mono', fontSize: 13, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box', letterSpacing: '0.1em' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(56,189,248,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.10)')}
                  required
                />
              </div>
              <div>
                {labelEl('Card Type')}
                <select
                  value={cardForm.cardType}
                  onChange={e => setCardForm(f => ({ ...f, cardType: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(8,13,26,0.85)', border: '1px solid rgba(148,163,184,0.10)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, color: '#e2e8f0', outline: 'none', appearance: 'none' }}
                >
                  <option value="VISA">Visa</option>
                  <option value="MASTERCARD">Mastercard</option>
                  <option value="AMEX">American Express</option>
                </select>
              </div>
              <div>
                {labelEl('Expiry Date (MM/YY)')}
                <input
                  type="text"
                  placeholder="09/28"
                  value={cardForm.expiryDate}
                  maxLength={5}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
                    setCardForm(f => ({ ...f, expiryDate: v }))
                  }}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(8,13,26,0.85)', border: '1px solid rgba(148,163,184,0.10)', borderRadius: 4, fontFamily: 'JetBrains Mono', fontSize: 13, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(56,189,248,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.10)')}
                  required
                />
              </div>
              <div>
                {labelEl('Balance (DT)')}
                <input
                  type="number"
                  placeholder="10000.00"
                  step="0.01"
                  min="0"
                  value={cardForm.balance}
                  onChange={e => setCardForm(f => ({ ...f, balance: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(8,13,26,0.85)', border: '1px solid rgba(148,163,184,0.10)', borderRadius: 4, fontFamily: 'JetBrains Mono', fontSize: 13, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(56,189,248,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.10)')}
                  required
                />
              </div>
            </div>
            {cardError && (
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, padding: '8px 12px' }}>{cardError}</div>
            )}
            <button type="submit" disabled={cardLoading} style={{ padding: '10px', background: cardLoading ? 'rgba(56,189,248,0.4)' : '#38bdf8', border: 'none', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 700, color: '#0a0f1e', cursor: cardLoading ? 'not-allowed' : 'pointer' }}>
              {cardLoading ? 'Adding...' : 'Add Card'}
            </button>
          </form>
        )}

        {/* Cards list */}
        {cards.length === 0 && !showAddCard && (
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#475569', padding: '20px 0', textAlign: 'center' }}>
            No payment cards yet — add your first card above
          </div>
        )}
        {cards.map(card => (
          <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderTop: '1px solid rgba(148,163,184,0.05)' }}>
            <div style={{ width: 52, height: 32, background: '#1e2d45', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Instrument Sans', fontSize: 9, fontWeight: 700, color: '#94a3b8' }}>{card.cardType}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#e2e8f0' }}>•••• •••• •••• {card.lastFour}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 3, alignItems: 'center' }}>
                <span style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#64748b' }}>Expires {card.expiryDate}</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: '#10b981' }}>
                  {Number(card.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })} DT
                </span>
              </div>
            </div>
            {card.primary && (
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, color: '#38bdf8', background: 'rgba(56,189,248,0.10)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 3, padding: '2px 8px' }}>PRIMARY</span>
            )}
            <button
              onClick={() => deleteCard(card.id)}
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 4, padding: '5px 10px', fontFamily: 'Instrument Sans', fontSize: 11, cursor: 'pointer' }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Security */}
      <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 24 }}>
        <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>Security</div>
        <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginBottom: 16 }}>Keep your account safe</div>
        <Toggle on={twoFA} set={setTwoFA} title="Two-Factor Authentication" desc="Require a verification code when signing in from a new device" />
        <Toggle on={alerts} set={setAlerts} title="Fraud Alert Notifications" desc="Get notified immediately when a transaction is flagged or blocked" />
        <Toggle on={digest} set={setDigest} title="Weekly Account Digest" desc="Receive a weekly summary of your spending and security events" />
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(148,163,184,0.06)', display: 'flex', gap: 10 }}>
          <button style={{ padding: '9px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#ef4444', cursor: 'pointer' }}>Change Password</button>
          <button style={{ padding: '9px 16px', background: 'transparent', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', cursor: 'pointer' }}>Download My Data</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={save} style={{ padding: '11px 24px', background: '#38bdf8', border: 'none', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 700, color: '#0a0f1e', cursor: 'pointer' }}>Save Changes</button>
        {saved && <span style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#10b981' }}>✓ Saved</span>}
      </div>
    </div>
  )
}
