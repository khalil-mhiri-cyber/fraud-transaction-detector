import { useState } from 'react'

interface Toggle { label: string; description: string; on: boolean }
interface Field { label: string; value: string }

export default function Settings() {
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState('Ahmed Khalid')
  const [email, setEmail] = useState('ahmed@sentinelai.io')
  const [threshold, setThreshold] = useState('60')
  const [alertEmail, setAlertEmail] = useState(true)
  const [alertSlack, setAlertSlack] = useState(false)
  const [autoBlock, setAutoBlock] = useState(true)
  const [autoBlockScore, setAutoBlockScore] = useState('90')
  const [twoFA, setTwoFA] = useState(true)
  const [apiKey] = useState('sk-sentinel-••••••••••••••••••••••••••••••••F2A1')
  const [tab, setTab] = useState<'profile' | 'rules' | 'notifications' | 'api'>('profile')

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: 'rgba(8,13,26,0.8)',
    border: '1px solid rgba(148,163,184,0.10)', borderRadius: 4,
    fontFamily: 'Instrument Sans', fontSize: 13, color: '#e2e8f0', outline: 'none',
    boxSizing: 'border-box' as const,
  }
  const labelStyle = { fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600 as const, color: '#94a3b8', display: 'block' as const, marginBottom: 6 }

  function ToggleRow({ label, desc, on, setOn }: { label: string; desc: string; on: boolean; setOn: (v: boolean) => void }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid rgba(148,163,184,0.06)' }}>
        <div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>{label}</div>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b', marginTop: 2 }}>{desc}</div>
        </div>
        <button
          onClick={() => setOn(!on)}
          style={{ width: 44, height: 24, borderRadius: 12, background: on ? '#f59e0b' : 'rgba(148,163,184,0.15)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
        >
          <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
        </button>
      </div>
    )
  }

  const tabs: { id: typeof tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'rules', label: 'Detection Rules' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'api', label: 'API & Access' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 760 }}>
      <div>
        <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Manage your account, detection rules, and integrations</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid rgba(148,163,184,0.08)', paddingBottom: 0 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? '#e2e8f0' : '#64748b',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '10px 16px',
              borderBottom: tab === t.id ? '2px solid #f59e0b' : '2px solid transparent',
              marginBottom: -1,
              transition: 'all 0.15s',
            }}
          >{t.label}</button>
        ))}
      </div>

      {/* Profile */}
      {tab === 'profile' && (
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #1e2d4a 0%, #38bdf8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Instrument Sans', fontSize: 20, fontWeight: 700, color: '#fff' }}>AK</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 16, fontWeight: 600, color: '#e2e8f0' }}>{name}</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b', marginTop: 2 }}>Senior Fraud Analyst · Admin</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderColor = 'rgba(245,158,11,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.1)')} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderColor = 'rgba(245,158,11,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.1)')} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Role</label>
              <select style={{ ...inputStyle, appearance: 'none' as const }}>
                <option>Senior Fraud Analyst</option>
                <option>Fraud Analyst</option>
                <option>Administrator</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Timezone</label>
              <select style={{ ...inputStyle, appearance: 'none' as const }}>
                <option>UTC+3 (Arabia Standard Time)</option>
                <option>UTC+0 (GMT)</option>
                <option>UTC-5 (Eastern Time)</option>
              </select>
            </div>
          </div>

          <ToggleRow label="Two-Factor Authentication" desc="Require 2FA for all logins to this account" on={twoFA} setOn={setTwoFA} />
        </div>
      )}

      {/* Detection rules */}
      {tab === 'rules' && (
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 28 }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 20 }}>Risk Thresholds</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Flag for Review (score ≥)</label>
              <input type="number" min="0" max="99" value={threshold} onChange={e => setThreshold(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderColor = 'rgba(245,158,11,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.1)')} />
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#64748b', marginTop: 4 }}>Transactions above this score enter the review queue</div>
            </div>
            <div>
              <label style={labelStyle}>Auto-Block Score (≥)</label>
              <input type="number" min="0" max="99" value={autoBlockScore} onChange={e => setAutoBlockScore(e.target.value)} style={inputStyle} onFocus={e => (e.target.style.borderColor = 'rgba(245,158,11,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.1)')} />
              <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#64748b', marginTop: 4 }}>Instantly block without analyst review</div>
            </div>
          </div>

          <ToggleRow label="Auto-Block High Risk" desc="Automatically block transactions scoring above the auto-block threshold" on={autoBlock} setOn={setAutoBlock} />
          <ToggleRow label="Velocity Check" desc="Flag accounts with 5+ transactions per hour from same IP" on={true} setOn={() => {}} />
          <ToggleRow label="Geo Anomaly Detection" desc="Alert on impossible travel patterns (3+ countries in 2hrs)" on={true} setOn={() => {}} />
          <ToggleRow label="Device Fingerprinting" desc="Flag logins from unrecognized devices after 90-day absence" on={true} setOn={() => {}} />
          <ToggleRow label="Night Transaction Watch" desc="Increase sensitivity for transactions between 22:00–06:00" on={false} setOn={() => {}} />
        </div>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 28 }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 20 }}>Alert Channels</div>
          <ToggleRow label="Email Alerts" desc="Send critical and high severity alerts to your email address" on={alertEmail} setOn={setAlertEmail} />
          <ToggleRow label="Slack Integration" desc="Post alerts to your team's Slack channel" on={alertSlack} setOn={setAlertSlack} />
          <ToggleRow label="Daily Digest" desc="Receive a daily summary of fraud activity each morning at 08:00" on={true} setOn={() => {}} />
          <ToggleRow label="Weekly Report" desc="Automated PDF report every Monday with trends and KPIs" on={false} setOn={() => {}} />
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(148,163,184,0.06)' }}>
            <label style={labelStyle}>Notification Email</label>
            <input value={email} style={inputStyle} readOnly onFocus={e => (e.target.style.borderColor = 'rgba(245,158,11,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.1)')} />
          </div>
        </div>
      )}

      {/* API */}
      {tab === 'api' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 28 }}>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 16 }}>API Key</div>
            <label style={labelStyle}>Production API Key</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input value={apiKey} readOnly style={{ ...inputStyle, fontFamily: 'JetBrains Mono', fontSize: 12, flex: 1 }} />
              <button style={{ padding: '10px 16px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: 600, color: '#f59e0b', cursor: 'pointer', flexShrink: 0 }}>Regenerate</button>
            </div>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 11, color: '#64748b', marginTop: 6 }}>Last used: 2 minutes ago from 192.168.xx.xx</div>
          </div>

          <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 28 }}>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 16 }}>Prediction Endpoint</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#94a3b8', background: 'rgba(8,13,26,0.6)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: '12px 16px', lineHeight: 1.8 }}>
              <span style={{ color: '#10b981' }}>POST</span> <span style={{ color: '#38bdf8' }}>https://api.sentinelai.io/v2/predict</span><br />
              <span style={{ color: '#64748b' }}>Authorization:</span> Bearer sk-sentinel-••••••F2A1<br />
              <span style={{ color: '#64748b' }}>Content-Type:</span> application/json
            </div>
          </div>
        </div>
      )}

      {/* Save button */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={save} style={{ padding: '11px 24px', background: '#f59e0b', border: 'none', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 700, color: '#0a0f1e', cursor: 'pointer' }}>
          Save Changes
        </button>
        {saved && <span style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#10b981' }}>✓ Changes saved</span>}
      </div>
    </div>
  )
}
