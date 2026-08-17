import { useState } from 'react'
import { useNavigate } from 'react-router'
import { TRANSACTIONS, riskColor, type TxStatus, type Device, type TxType } from '../data/mockData'

type SortKey = 'date' | 'amount' | 'riskScore'

export default function Transactions() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TxStatus | 'all'>('all')
  const [deviceFilter, setDeviceFilter] = useState<Device | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortAsc, setSortAsc] = useState(false)

  const filtered = TRANSACTIONS
    .filter(tx => {
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false
      if (deviceFilter !== 'all' && tx.device !== deviceFilter) return false
      if (search && !tx.id.toLowerCase().includes(search.toLowerCase()) && !tx.merchant.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      let av: number, bv: number
      if (sortKey === 'amount') { av = a.amount; bv = b.amount }
      else if (sortKey === 'riskScore') { av = a.riskScore; bv = b.riskScore }
      else { av = new Date(a.date + ' ' + a.time).getTime(); bv = new Date(b.date + ' ' + b.time).getTime() }
      return sortAsc ? av - bv : bv - av
    })

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortAsc(a => !a)
    else { setSortKey(k); setSortAsc(false) }
  }

  const pill = (active: boolean, label: string, onClick: () => void) => (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: active ? 600 : 400,
        padding: '5px 12px', borderRadius: 4, border: 'none', cursor: 'pointer',
        background: active ? 'rgba(245,158,11,0.12)' : 'rgba(148,163,184,0.06)',
        color: active ? '#f59e0b' : '#64748b',
        transition: 'all 0.15s',
      }}
    >{label}</button>
  )

  const sortArrow = (k: SortKey) => sortKey === k ? (sortAsc ? ' ↑' : ' ↓') : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>Transactions</h1>
        <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{TRANSACTIONS.length} transactions loaded · {TRANSACTIONS.filter(t => t.status === 'fraud').length} flagged as fraud</p>
      </div>

      {/* Filters */}
      <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by ID or merchant..."
          style={{ flex: '1 1 200px', padding: '8px 12px', background: 'rgba(8,13,26,0.8)', border: '1px solid rgba(148,163,184,0.10)', borderRadius: 4, fontFamily: 'Instrument Sans', fontSize: 13, color: '#e2e8f0', outline: 'none', minWidth: 180 }}
        />
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563', letterSpacing: '0.06em' }}>STATUS</span>
          {pill(statusFilter === 'all', 'All', () => setStatusFilter('all'))}
          {pill(statusFilter === 'safe', 'Safe', () => setStatusFilter('safe'))}
          {pill(statusFilter === 'fraud', 'Fraud', () => setStatusFilter('fraud'))}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563', letterSpacing: '0.06em' }}>DEVICE</span>
          {(['all', 'PC', 'Mobile', 'Unknown'] as const).map(d => pill(deviceFilter === d, d === 'all' ? 'All' : d, () => setDeviceFilter(d)))}
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>{filtered.length} results</div>
      </div>

      {/* Table */}
      <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr 88px 96px 88px 80px 80px', gap: 0, borderBottom: '1px solid rgba(148,163,184,0.08)', padding: '10px 20px', background: '#0a1020' }}>
          {[
            { label: 'ID', key: null },
            { label: 'MERCHANT', key: null },
            { label: 'DEVICE', key: null },
            { label: 'AMOUNT', key: 'amount' as SortKey },
            { label: 'DATE', key: 'date' as SortKey },
            { label: 'RISK', key: 'riskScore' as SortKey },
            { label: 'STATUS', key: null },
          ].map(({ label, key }) => (
            <button
              key={label}
              onClick={() => key && toggleSort(key)}
              style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: key && sortKey === key ? '#f59e0b' : '#4b5563', background: 'none', border: 'none', cursor: key ? 'pointer' : 'default', textAlign: 'left', padding: 0 }}
            >{label}{key && sortArrow(key)}</button>
          ))}
        </div>

        {/* Rows */}
        <div>
          {filtered.map((tx, i) => (
            <div
              key={tx.id}
              onClick={() => navigate(`/admin/transactions/${tx.id}`)}
              style={{
                display: 'grid', gridTemplateColumns: '96px 1fr 88px 96px 88px 80px 80px', gap: 0,
                padding: '13px 20px', cursor: 'pointer',
                borderTop: i > 0 ? '1px solid rgba(148,163,184,0.05)' : 'none',
                borderLeft: tx.status === 'fraud' ? '2px solid rgba(239,68,68,0.4)' : '2px solid transparent',
                paddingLeft: 18,
                transition: 'background 0.12s',
                alignItems: 'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(148,163,184,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#94a3b8' }}>{tx.id}</span>
              <div>
                <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, fontWeight: 500, color: '#cbd5e1' }}>{tx.merchant}</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563', marginTop: 2 }}>{tx.category} · {tx.location}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <DeviceIcon device={tx.device} />
                <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#94a3b8' }}>{tx.device}</span>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>${tx.amount.toLocaleString()}</span>
              <div>
                <div style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#94a3b8' }}>{tx.date}</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563' }}>{tx.time}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 28, height: 5, borderRadius: 2, background: 'rgba(148,163,184,0.08)', overflow: 'hidden' }}>
                  <div style={{ width: `${tx.riskScore}%`, height: '100%', background: riskColor(tx.riskScore), borderRadius: 2 }} />
                </div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, color: riskColor(tx.riskScore) }}>{tx.riskScore}</span>
              </div>
              <StatusBadge status={tx.status} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '48px 20px', textAlign: 'center', fontFamily: 'Instrument Sans', fontSize: 13, color: '#4b5563' }}>No transactions match your filters</div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: TxStatus }) {
  return (
    <span style={{
      fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
      padding: '3px 8px', borderRadius: 3,
      background: status === 'fraud' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
      color: status === 'fraud' ? '#ef4444' : '#10b981',
    }}>
      {status === 'fraud' ? 'FRAUD' : 'SAFE'}
    </span>
  )
}

function DeviceIcon({ device }: { device: Device }) {
  const color = '#64748b'
  if (device === 'Mobile') return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2.5" y="0.5" width="7" height="11" rx="1.5" stroke={color} strokeWidth={1.2}/><circle cx="6" cy="9.5" r="0.5" fill={color}/></svg>
  )
  if (device === 'Tablet') return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1.5" width="10" height="9" rx="1.5" stroke={color} strokeWidth={1.2}/><circle cx="9" cy="6" r="0.5" fill={color}/></svg>
  )
  if (device === 'Unknown') return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#ef4444" strokeWidth={1.2}/><path d="M4.5 4.5L7.5 7.5M7.5 4.5L4.5 7.5" stroke="#ef4444" strokeWidth={1.2} strokeLinecap="round"/></svg>
  )
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="0.5" y="1.5" width="11" height="8" rx="1" stroke={color} strokeWidth={1.2}/><path d="M4 9.5h4M6 9.5v1" stroke={color} strokeWidth={1.2} strokeLinecap="round"/></svg>
  )
}
