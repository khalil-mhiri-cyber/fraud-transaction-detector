import { useState } from 'react'

export default function UserProfile() {
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState('John Doe')
  const [email, setEmail] = useState('john.doe@email.com')
  const [phone, setPhone] = useState('+1 (555) 012-3456')
  const [alerts, setAlerts] = useState(true)
  const [digest, setDigest] = useState(false)
  const [twoFA, setTwoFA] = useState(true)

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const input = (value: string, onChange: (v: string) => void, placeholder?: string) => (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', padding: '10px 14px', background: 'rgba(8,13,26,0.85)', border: '1px solid rgba(148,163,184,0.10)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' as const }}
      onFocus={e => (e.target.style.borderColor = 'rgba(56,189,248,0.4)')}
      onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.10)')}
    />
  )

  const label = (text: string) => (
    <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>{text}</div>
  )

  function Toggle({ on, set, title, desc }: { on: boolean; set: (v: boolean) => void; title: string; desc: string }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid rgba(148,163,184,0.06)' }}>
        <div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>{title}</div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginTop: 2 }}>{desc}</div>
        </div>
        <button onClick={() => set(!on)} style={{ width: 44, height: 24, borderRadius: 12, background: on ? '#38bdf8' : 'rgba(148,163,184,0.15)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
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

      {/* Avatar card */}
      <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: '28px', display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a5f 0%, #38bdf8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Instrument Sans', fontSize: 24, fontWeight: 700, color: '#fff' }}>JD</span>
        </div>
        <div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>{name}</div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', marginTop: 2 }}>Customer Account · Member since Jan 2024</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {[['Account', '••4821'], ['Plan', 'Premium'], ['Status', 'Active']].map(([k, v]) => (
              <span key={k} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8', background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 3, padding: '3px 8px' }}>{k}: {v}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 24 }}>
        <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 20 }}>Personal Information</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>{label('Full Name')}{input(name, setName)}</div>
          <div>{label('Email Address')}{input(email, setEmail)}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>{label('Phone Number')}{input(phone, setPhone)}</div>
          <div>
            {label('Currency Preference')}
            <select style={{ width: '100%', padding: '10px 14px', background: 'rgba(8,13,26,0.85)', border: '1px solid rgba(148,163,184,0.10)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, color: '#e2e8f0', outline: 'none', appearance: 'none' as const }}>
              <option>USD — US Dollar</option>
              <option>EUR — Euro</option>
              <option>GBP — British Pound</option>
              <option>SAR — Saudi Riyal</option>
            </select>
          </div>
        </div>
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

      {/* Linked cards */}
      <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 24 }}>
        <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 16 }}>Linked Payment Methods</div>
        {[
          { label: 'Visa', last: '4821', exp: '09/28', primary: true },
          { label: 'Mastercard', last: '2934', exp: '03/27', primary: false },
        ].map(card => (
          <div key={card.last} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderTop: '1px solid rgba(148,163,184,0.05)' }}>
            <div style={{ width: 44, height: 28, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Instrument Sans', fontSize: 9, fontWeight: 700, color: '#94a3b8' }}>{card.label.toUpperCase()}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#e2e8f0' }}>•••• •••• •••• {card.last}</div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#64748b', marginTop: 2 }}>Expires {card.exp}</div>
            </div>
            {card.primary && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, color: '#38bdf8', background: 'rgba(56,189,248,0.10)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 3, padding: '2px 8px' }}>PRIMARY</span>}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={save} style={{ padding: '11px 24px', background: '#38bdf8', border: 'none', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 700, color: '#0a0f1e', cursor: 'pointer' }}>Save Changes</button>
        {saved && <span style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#10b981' }}>✓ Saved</span>}
      </div>
    </div>
  )
}
