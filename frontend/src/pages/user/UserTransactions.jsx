import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { riskColor } from '../../utils/risk.js'
import api from '../../services/api.js'

const STATUS_CFG = {
  approved: { label: 'Approved', bg: 'rgba(16,185,129,0.10)', color: '#10b981' },
  flagged:  { label: 'Flagged',  bg: 'rgba(245,158,11,0.10)', color: '#f59e0b' },
  blocked:  { label: 'Blocked',  bg: 'rgba(239,68,68,0.10)',  color: '#ef4444' },
  pending:  { label: 'Pending',  bg: 'rgba(148,163,184,0.10)', color: '#94a3b8' },
}

const CAT_ICON = {
  TRANSFER: '↗', CASH_OUT: '↙', PAYMENT: '💳', CASH_IN: '↙',
  DEBIT: '↗', Crypto: '₿', Subscription: '▶', Electronics: '💻',
}

function txStatus(tx) {
  // Admin decision is ALWAYS the final word
  if (tx.adminStatus === 'APPROVED') return 'approved'
  if (tx.adminStatus === 'BLOCKED') return 'blocked'
  // No admin decision yet → always PENDING (regardless of AI score)
  return 'pending'
}

function txNote(tx) {
  const s = txStatus(tx)
  if (s === 'blocked') return 'Blocked by fraud system'
  if (s === 'flagged') return 'Under manual review'
  if (s === 'pending') return 'Awaiting review'
  return ''
}

export default function UserTransactions() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/transactions')
      .then(r => setTransactions(r.data))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false))
  }, [])

  const sorted = [...transactions].sort((a, b) => new Date(b.time) - new Date(a.time))
  const filtered = sorted.filter(t => filter === 'all' || txStatus(t) === filter)
  const totalSpent = sorted.filter(t => txStatus(t) === 'approved').reduce((s, t) => s + Number(t.amount), 0)

  const counts = {
    all: sorted.length,
    approved: sorted.filter(t => txStatus(t) === 'approved').length,
    flagged: sorted.filter(t => txStatus(t) === 'flagged').length,
    blocked: sorted.filter(t => txStatus(t) === 'blocked').length,
    pending: sorted.filter(t => txStatus(t) === 'pending').length,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>My Transactions</h1>
          <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
            {sorted.length} transactions · {totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })} DT approved total
          </p>
        </div>
        <button onClick={() => navigate('/user/new-transaction')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#38bdf8', border: 'none', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 700, color: '#0a0f1e', cursor: 'pointer' }}>
          + New Transfer
        </button>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { key: 'all', label: 'All', color: '#94a3b8' },
          { key: 'approved', label: 'Approved', color: '#10b981' },
          { key: 'pending', label: 'Pending', color: '#94a3b8' },
          { key: 'flagged', label: 'Flagged', color: '#f59e0b' },
          { key: 'blocked', label: 'Blocked', color: '#ef4444' },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 4,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              background: filter === key ? `${color}18` : 'rgba(148,163,184,0.05)',
              outline: filter === key ? `1.5px solid ${color}40` : 'none',
            }}
          >
            <span style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: filter === key ? 600 : 400, color: filter === key ? color : '#64748b' }}>{label}</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, color: filter === key ? color : '#4b5563', background: `${color}15`, borderRadius: 10, padding: '1px 7px' }}>{counts[key]}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, overflow: 'hidden' }}>
        {loading && (
          <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b' }}>Loading transactions...</div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b' }}>No transactions found</div>
        )}
        {filtered.map((tx, i) => {
          const status = txStatus(tx)
          const cfg = STATUS_CFG[status]
          const note = txNote(tx)
          const icon = CAT_ICON[tx.type] || '↗'
          const riskPct = Math.round(Number(tx.fraudProbability) * 100)
          const color = riskColor(riskPct)
          const borderColor = status === 'blocked' ? 'rgba(239,68,68,0.5)' : status === 'flagged' ? 'rgba(245,158,11,0.4)' : status === 'pending' ? 'rgba(148,163,184,0.3)' : 'transparent'
          const date = new Date(tx.time).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
          const time = new Date(tx.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

          return (
            <div
              key={tx.id}
              onClick={() => navigate(`/user/transactions/TX-${tx.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px',
                borderTop: i > 0 ? '1px solid rgba(148,163,184,0.05)' : 'none',
                cursor: 'pointer', transition: 'background 0.12s',
                borderLeft: `3px solid ${borderColor}`,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(148,163,184,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(148,163,184,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                {icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 500, color: '#e2e8f0', marginBottom: 3 }}>{tx.place || tx.type}</div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b' }}>{tx.type}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563' }}>·</span>
                  <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b' }}>{date} at {time}</span>
                  {note && <>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563' }}>·</span>
                    <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: cfg.color }}>{note}</span>
                  </>}
                </div>
              </div>

              {/* Risk bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 32, height: 5, background: 'rgba(148,163,184,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${riskPct}%`, height: '100%', background: color, borderRadius: 2 }} />
                </div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, color, width: 22 }}>{riskPct}</span>
              </div>

              {/* Amount */}
              <div style={{ textAlign: 'right', minWidth: 100 }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 700, color: status === 'blocked' ? '#ef4444' : '#e2e8f0' }}>
                  {status === 'blocked' ? '-' : ''}{Number(tx.amount).toFixed(2)} DT
                </div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 2, background: cfg.bg, color: cfg.color }}>
                  {cfg.label.toUpperCase()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
