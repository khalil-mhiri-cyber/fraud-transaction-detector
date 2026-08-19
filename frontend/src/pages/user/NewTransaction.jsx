import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'

const INIT = {
  recipientName: '',
  recipientAccount: '',
  amount: '',
  currency: 'DT',
  txType: 'TRANSFER',
  device: 'PC',
  description: '',
}

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: 'rgba(8,13,26,0.85)',
  border: '1px solid rgba(148,163,184,0.10)',
  borderRadius: 4, fontFamily: 'Instrument Sans',
  fontSize: 13, color: '#e2e8f0', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.15s',
}
const labelStyle = {
  fontFamily: 'Instrument Sans', fontSize: 12,
  fontWeight: 600, color: '#94a3b8',
  display: 'block', marginBottom: 6,
}
const focus = e => (e.target.style.borderColor = 'rgba(56,189,248,0.4)')
const blur  = e => (e.target.style.borderColor = 'rgba(148,163,184,0.10)')

export default function NewTransaction() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INIT)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const amt = parseFloat(form.amount) || 0

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      const res = await api.post('/transactions', {
        type: form.txType,
        amount: amt,
        oldbalanceOrg: 0,
        newbalanceOrig: 0,
        oldbalanceDest: 0,
        newbalanceDest: 0,
        place: form.recipientName || 'Unknown',
        device: form.device,
        time: new Date().toISOString().slice(0, 19),
      })
      setDone({ txId: `TX-${res.data.id}` })
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed. Please try again.')
    } finally {
      setSending(false)
    }
  }

  // ── Success screen ────────────────────────────────────────────
  if (done) {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{
          background: '#0d1528',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 8, padding: '48px 36px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>⏳</div>
          <h2 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: '#f59e0b', margin: '0 0 10px' }}>
            Transfer Submitted
          </h2>
          <p style={{ fontFamily: 'Instrument Sans', fontSize: 14, color: '#94a3b8', margin: '0 0 32px', lineHeight: 1.7 }}>
            Your transfer <strong style={{ color: '#e2e8f0' }}>{done.txId}</strong> is pending review.<br />
            You'll be notified once it's processed by our team.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/user/transactions')}
              style={{ padding: '10px 22px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 600, color: '#38bdf8', cursor: 'pointer' }}
            >
              View Transactions
            </button>
            <button
              onClick={() => { setForm(INIT); setDone(null) }}
              style={{ padding: '10px 22px', background: 'transparent', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', cursor: 'pointer' }}
            >
              New Transfer
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>
          New Transfer
        </h1>
        <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
          Fill in the details below and submit your transfer for review
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 4, padding: '12px 16px', fontFamily: 'Instrument Sans', fontSize: 13, color: '#ef4444' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 620 }}>
        <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Recipient */}
          <div>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid rgba(148,163,184,0.07)' }}>
              Recipient Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Recipient Name *</label>
                <input placeholder="Jane Smith" value={form.recipientName} onChange={set('recipientName')} style={inputStyle} onFocus={focus} onBlur={blur} required />
              </div>
              <div>
                <label style={labelStyle}>Account / IBAN</label>
                <input placeholder="GB29 NWBK 6016 1331 9268 19" value={form.recipientAccount} onChange={set('recipientAccount')} style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
            </div>
          </div>

          {/* Transfer details */}
          <div>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid rgba(148,163,184,0.07)' }}>
              Transfer Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Currency *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select value={form.currency} onChange={set('currency')} style={{ ...inputStyle, width: 90, flexShrink: 0, appearance: 'none' }}>
                    {['DT', 'USD', 'EUR', 'GBP', 'SAR'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input type="number" min="0.01" step="0.01" placeholder="0.00" value={form.amount} onChange={set('amount')} style={{ ...inputStyle, flex: 1 }} onFocus={focus} onBlur={blur} required />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Transfer Type *</label>
                <select value={form.txType} onChange={set('txType')} style={{ ...inputStyle, appearance: 'none' }}>
                  {['TRANSFER', 'PAYMENT', 'CASH_OUT', 'CASH_IN', 'DEBIT'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Device</label>
                <select value={form.device} onChange={set('device')} style={{ ...inputStyle, appearance: 'none' }}>
                  {['PC', 'Mobile', 'Tablet'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Note (optional)</label>
                <input placeholder="Invoice payment, rent..." value={form.description} onChange={set('description')} style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={sending}
            style={{
              padding: '13px', background: sending ? 'rgba(56,189,248,0.4)' : '#38bdf8',
              border: 'none', borderRadius: 4, fontFamily: 'Instrument Sans',
              fontSize: 14, fontWeight: 700, color: '#0a0f1e',
              cursor: sending ? 'not-allowed' : 'pointer', marginTop: 4,
            }}
          >
            {sending ? 'Sending...' : '▷ Send Transfer'}
          </button>
        </div>
      </form>
    </div>
  )
}
