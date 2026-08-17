import { useState } from 'react'
import { useNavigate } from 'react-router'
import { riskColor } from '../../data/mockData'

const MY_TRANSACTIONS = [
  { id: 'TX-1042', merchant: 'Crypto Exchange Pro', category: 'Crypto', amount: 4892.50, currency: 'USD', date: '2026-08-17', time: '14:23', status: 'blocked', riskScore: 94, note: 'Blocked by fraud system' },
  { id: 'TX-1040', merchant: 'Wire Transfer', category: 'Transfer', amount: 1240.00, currency: 'USD', date: '2026-08-17', time: '14:22', status: 'flagged', riskScore: 72, note: 'Under manual review' },
  { id: 'TX-1037', merchant: 'Best Buy', category: 'Electronics', amount: 445.20, currency: 'USD', date: '2026-08-17', time: '14:20', status: 'flagged', riskScore: 47, note: 'Amount above average' },
  { id: 'TX-1039', merchant: 'Spotify Premium', category: 'Subscription', amount: 59.99, currency: 'GBP', date: '2026-08-17', time: '14:21', status: 'approved', riskScore: 8, note: '' },
  { id: 'TX-1036', merchant: 'Uber Eats', category: 'Food & Drink', amount: 12.50, currency: 'USD', date: '2026-08-17', time: '14:20', status: 'approved', riskScore: 6, note: '' },
  { id: 'TX-1034', merchant: 'Adobe Creative Cloud', category: 'Subscription', amount: 199.99, currency: 'USD', date: '2026-08-16', time: '09:14', status: 'approved', riskScore: 11, note: '' },
  { id: 'TX-1033', merchant: 'Coinbase', category: 'Crypto', amount: 850.00, currency: 'USD', date: '2026-08-16', time: '18:42', status: 'approved', riskScore: 38, note: '' },
  { id: 'TX-1031', merchant: 'Netflix', category: 'Subscription', amount: 32.00, currency: 'USD', date: '2026-08-16', time: '11:00', status: 'approved', riskScore: 5, note: '' },
  { id: 'TX-1030', merchant: 'Luxury Watch Co', category: 'Shopping', amount: 2400.00, currency: 'EUR', date: '2026-08-15', time: '15:30', status: 'approved', riskScore: 29, note: '' },
  { id: 'TX-1028', merchant: 'Whole Foods', category: 'Grocery', amount: 75.00, currency: 'USD', date: '2026-08-15', time: '13:20', status: 'approved', riskScore: 7, note: '' },
]

const STATUS_CFG = {
  approved: { label: 'Approved', bg: 'rgba(16,185,129,0.10)', color: '#10b981' },
  flagged:  { label: 'Flagged',  bg: 'rgba(245,158,11,0.10)', color: '#f59e0b' },
  blocked:  { label: 'Blocked',  bg: 'rgba(239,68,68,0.10)',  color: '#ef4444' },
}

const CAT_ICON: Record<string, string> = {
  Crypto: '₿', Transfer: '↗', Electronics: '💻', Subscription: '▶', 'Food & Drink': '🍔', Shopping: '🛍', Grocery: '🛒',
}

export default function UserTransactions() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'approved' | 'flagged' | 'blocked'>('all')

  const filtered = MY_TRANSACTIONS.filter(t => filter === 'all' || t.status === filter)
  const totalSpent = MY_TRANSACTIONS.filter(t => t.status === 'approved').reduce((s, t) => s + t.amount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>My Transactions</h1>
          <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{MY_TRANSACTIONS.length} transactions · ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })} approved total</p>
        </div>
        <button onClick={() => navigate('/user/new-transaction')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#38bdf8', border: 'none', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 700, color: '#0a0f1e', cursor: 'pointer' }}>+ New Transfer</button>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { key: 'all', label: 'All', count: MY_TRANSACTIONS.length, color: '#94a3b8' },
          { key: 'approved', label: 'Approved', count: MY_TRANSACTIONS.filter(t => t.status === 'approved').length, color: '#10b981' },
          { key: 'flagged', label: 'Flagged', count: MY_TRANSACTIONS.filter(t => t.status === 'flagged').length, color: '#f59e0b' },
          { key: 'blocked', label: 'Blocked', count: MY_TRANSACTIONS.filter(t => t.status === 'blocked').length, color: '#ef4444' },
        ].map(({ key, label, count, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 4, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              background: filter === key ? `${color}18` : 'rgba(148,163,184,0.05)',
              outline: filter === key ? `1.5px solid ${color}40` : 'none',
            }}
          >
            <span style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: filter === key ? 600 : 400, color: filter === key ? color : '#64748b' }}>{label}</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, color: filter === key ? color : '#4b5563', background: `${color}15`, borderRadius: 10, padding: '1px 7px' }}>{count}</span>
          </button>
        ))}
      </div>

      {/* Transaction list */}
      <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, overflow: 'hidden' }}>
        {filtered.map((tx, i) => {
          const cfg = STATUS_CFG[tx.status as keyof typeof STATUS_CFG]
          return (
            <div
              key={tx.id}
              onClick={() => navigate(`/user/transactions/${tx.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px',
                borderTop: i > 0 ? '1px solid rgba(148,163,184,0.05)' : 'none',
                cursor: 'pointer', transition: 'background 0.12s',
                borderLeft: tx.status === 'blocked' ? '3px solid rgba(239,68,68,0.5)' : tx.status === 'flagged' ? '3px solid rgba(245,158,11,0.4)' : '3px solid transparent',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(148,163,184,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Icon */}
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(148,163,184,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                {CAT_ICON[tx.category] || '↗'}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 500, color: '#e2e8f0', marginBottom: 3 }}>{tx.merchant}</div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b' }}>{tx.category}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563' }}>·</span>
                  <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b' }}>{tx.date} at {tx.time}</span>
                  {tx.note && <>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563' }}>·</span>
                    <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: cfg.color }}>{tx.note}</span>
                  </>}
                </div>
              </div>

              {/* Risk */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 32, height: 5, background: 'rgba(148,163,184,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${tx.riskScore}%`, height: '100%', background: riskColor(tx.riskScore), borderRadius: 2 }} />
                </div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, color: riskColor(tx.riskScore), width: 22 }}>{tx.riskScore}</span>
              </div>

              {/* Amount */}
              <div style={{ textAlign: 'right', minWidth: 100 }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 700, color: tx.status === 'blocked' ? '#ef4444' : '#e2e8f0' }}>
                  {tx.status === 'blocked' ? '-' : ''}{tx.currency} {tx.amount.toFixed(2)}
                </div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 2, background: cfg.bg, color: cfg.color }}>{cfg.label.toUpperCase()}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
