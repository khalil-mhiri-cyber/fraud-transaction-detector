import { useState } from 'react'
import { useNavigate } from 'react-router'
import { riskColor, riskLevel } from '../data/mockData'

type Severity = 'critical' | 'high' | 'medium' | 'low'
type AlertStatus = 'open' | 'investigating' | 'resolved'

interface Alert {
  id: string
  type: string
  severity: Severity
  title: string
  description: string
  account: string
  txId: string | null
  amount: string
  location: string
  time: string
  status: AlertStatus
  score: number
}

const ALERTS: Alert[] = [
  { id: 'ALT-2241', type: 'Velocity Breach', severity: 'critical', title: '14 transactions in 60 min from single IP', description: 'Account ••1177 recorded 14 rapid transactions totaling $42,100 from IP 186.5.xx. All transactions directed to a crypto exchange.', account: '••1177', txId: 'TX-1035', amount: '$42,100', location: 'Panama City, PA', time: '14:19', status: 'open', score: 97 },
  { id: 'ALT-2240', type: 'Geo Anomaly', severity: 'critical', title: 'Card used in 3 countries within 2 hours', description: 'Card ••3308 swiped in Miami, then Cancún, then flagged access attempt from Lagos — impossible travel pattern detected.', account: '••3308', txId: 'TX-1038', amount: '$3,100', location: 'Cancún, MX', time: '14:21', status: 'investigating', score: 88 },
  { id: 'ALT-2239', type: 'ML Flag', severity: 'high', title: 'Behavioral pattern deviation — risk score Δ+41', description: 'Account ••7701 shows 41-point spike in ML risk score compared to 30-day behavioral baseline. Unusual transfer size and timing.', account: '••7701', txId: 'TX-1040', amount: '$1,240', location: 'Miami, US', time: '14:22', status: 'open', score: 72 },
  { id: 'ALT-2238', type: 'Night Transaction', severity: 'critical', title: 'Maximum amount wire at 03:17 from Bucharest', description: '$15,000 international wire initiated at 3am local time from an unknown device in Romania to an offshore account.', account: '••3301', txId: 'TX-1032', amount: '$15,000', location: 'Bucharest, RO', time: '03:17', status: 'resolved', score: 97 },
  { id: 'ALT-2237', type: 'Device Change', severity: 'medium', title: 'New unknown device after 180 days of inactivity', description: 'Account ••4821 had no activity for 6 months, now accessed from an unrecognized device attempting a $4,892 crypto purchase.', account: '••4821', txId: 'TX-1042', amount: '$4,892', location: 'Lagos, NG', time: '14:23', status: 'open', score: 94 },
  { id: 'ALT-2236', type: 'Amount Spike', severity: 'medium', title: 'Transaction 6.2× above 90-day spending average', description: 'Account ••6614 average monthly spend is $280. This $445 electronics purchase is 6.2× above expected range for this account.', account: '••6614', txId: 'TX-1037', amount: '$445', location: 'Austin, US', time: '14:20', status: 'resolved', score: 47 },
  { id: 'ALT-2235', type: 'Gift Card Pattern', severity: 'high', title: 'Bulk gift card purchase — known money-laundering signal', description: 'Account ••5544 purchased $4,500 in gift cards at 22:45. Gift card purchases above $500 in single session are flagged as laundering risk.', account: '••5544', txId: 'TX-1029', amount: '$4,500', location: 'Houston, US', time: '22:45', status: 'investigating', score: 86 },
]

const SEV_ORDER: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 }

export default function Alerts() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all')
  const [sevFilter, setSevFilter] = useState<Severity | 'all'>('all')
  const [statuses, setStatuses] = useState<Record<string, AlertStatus>>({})

  function updateStatus(id: string, s: AlertStatus) {
    setStatuses(prev => ({ ...prev, [id]: s }))
  }

  const filtered = ALERTS
    .filter(a => {
      const st = statuses[a.id] || a.status
      if (statusFilter !== 'all' && st !== statusFilter) return false
      if (sevFilter !== 'all' && a.severity !== sevFilter) return false
      return true
    })
    .sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity])

  const open = ALERTS.filter(a => (statuses[a.id] || a.status) === 'open').length
  const investigating = ALERTS.filter(a => (statuses[a.id] || a.status) === 'investigating').length

  const chip = (label: string, active: boolean, onClick: () => void, color?: string) => (
    <button onClick={onClick} style={{ fontFamily: 'Instrument Sans', fontSize: 12, fontWeight: active ? 600 : 400, padding: '5px 12px', borderRadius: 4, border: 'none', cursor: 'pointer', background: active ? (color ? `rgba(${color},0.15)` : 'rgba(245,158,11,0.12)') : 'rgba(148,163,184,0.06)', color: active ? (color ? `rgb(${color})` : '#f59e0b') : '#64748b', transition: 'all 0.15s' }}>{label}</button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>Alerts</h1>
          <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{open} open · {investigating} under investigation</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['critical', 'high', 'medium'] as Severity[]).map(s => {
            const count = ALERTS.filter(a => a.severity === s && (statuses[a.id] || a.status) !== 'resolved').length
            const colors: Record<Severity, string> = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#38bdf8' }
            return count > 0 ? (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: `${colors[s]}18`, border: `1px solid ${colors[s]}30`, borderRadius: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors[s] }} />
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, color: colors[s], textTransform: 'uppercase' }}>{count} {s}</span>
              </div>
            ) : null
          })}
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, padding: '14px 18px', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563', letterSpacing: '0.06em' }}>STATUS</span>
          {chip('All', statusFilter === 'all', () => setStatusFilter('all'))}
          {chip('Open', statusFilter === 'open', () => setStatusFilter('open'))}
          {chip('Investigating', statusFilter === 'investigating', () => setStatusFilter('investigating'))}
          {chip('Resolved', statusFilter === 'resolved', () => setStatusFilter('resolved'))}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563', letterSpacing: '0.06em' }}>SEVERITY</span>
          {chip('All', sevFilter === 'all', () => setSevFilter('all'))}
          {chip('Critical', sevFilter === 'critical', () => setSevFilter('critical'), '239,68,68')}
          {chip('High', sevFilter === 'high', () => setSevFilter('high'), '249,115,22')}
          {chip('Medium', sevFilter === 'medium', () => setSevFilter('medium'), '245,158,11')}
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>{filtered.length} alerts</div>
      </div>

      {/* Alert cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(alert => {
          const st = statuses[alert.id] || alert.status
          const sevColors: Record<Severity, string> = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#38bdf8' }
          const c = sevColors[alert.severity]

          return (
            <div key={alert.id} style={{ background: '#0d1528', border: `1px solid ${st === 'resolved' ? 'rgba(148,163,184,0.08)' : `${c}20`}`, borderRadius: 4, padding: '18px 22px', opacity: st === 'resolved' ? 0.6 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                {/* Severity indicator */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 2 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, boxShadow: st !== 'resolved' ? `0 0 8px ${c}` : 'none', display: 'block' }} />
                  <div style={{ width: 1, flex: 1, background: `${c}20` }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, color: c, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{alert.severity}</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563' }}>·</span>
                    <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b' }}>{alert.type}</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563' }}>·</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563' }}>{alert.id}</span>
                    <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4b5563' }}>{alert.time}</span>
                  </div>

                  <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>{alert.title}</div>
                  <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', lineHeight: 1.5, marginBottom: 14 }}>{alert.description}</div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>Account: <span style={{ color: '#94a3b8' }}>{alert.account}</span></span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>Exposure: <span style={{ color: c, fontWeight: 700 }}>{alert.amount}</span></span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>Location: <span style={{ color: '#94a3b8' }}>{alert.location}</span></span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>Risk: <span style={{ color: riskColor(alert.score), fontWeight: 700 }}>{alert.score}</span></span>
                    </div>

                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                      {alert.txId && (
                        <button onClick={() => navigate(`/admin/transactions/${alert.txId}`)} style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#38bdf8', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 3, padding: '5px 10px', cursor: 'pointer' }}>View TX</button>
                      )}
                      {st === 'open' && <button onClick={() => updateStatus(alert.id, 'investigating')} style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#f59e0b', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 3, padding: '5px 10px', cursor: 'pointer' }}>Investigate</button>}
                      {st !== 'resolved' && <button onClick={() => updateStatus(alert.id, 'resolved')} style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#10b981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 3, padding: '5px 10px', cursor: 'pointer' }}>Resolve</button>}
                      {st === 'resolved' && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#10b981' }}>✓ Resolved</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
