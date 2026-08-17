export type RiskLevel = 'safe' | 'medium' | 'high' | 'critical'
export type TxStatus = 'safe' | 'fraud'
export type Device = 'PC' | 'Mobile' | 'Tablet' | 'Unknown'
export type TxType = 'Transfer' | 'Purchase' | 'ATM' | 'Subscription' | 'Crypto' | 'Investment'

export interface Transaction {
  id: string
  amount: number
  currency: string
  merchant: string
  category: TxType
  device: Device
  location: string
  date: string
  time: string
  status: TxStatus
  riskScore: number
  account: string
  ip: string
  reasons: string[]
  velocity: number
  recurring: boolean
}

export const TRANSACTIONS: Transaction[] = [
  { id: 'TX-1042', amount: 5000, currency: 'USD', merchant: 'Crypto Exchange Pro', category: 'Crypto', device: 'PC', location: 'Lagos, NG', date: '2026-08-17', time: '14:23', status: 'fraud', riskScore: 94, account: '••4821', ip: '41.58.xx.xx', reasons: ['Unusual amount', 'Suspicious device', 'Abnormal transaction pattern'], velocity: 12, recurring: false },
  { id: 'TX-1041', amount: 287, currency: 'EUR', merchant: 'Amazon DE', category: 'Purchase', device: 'PC', location: 'Berlin, DE', date: '2026-08-17', time: '14:22', status: 'safe', riskScore: 14, account: '••2934', ip: '77.12.xx.xx', reasons: [], velocity: 2, recurring: false },
  { id: 'TX-1040', amount: 1240, currency: 'USD', merchant: 'Wire Transfer', category: 'Transfer', device: 'Mobile', location: 'Miami, US', date: '2026-08-17', time: '14:22', status: 'fraud', riskScore: 72, account: '••7701', ip: '205.4.xx.xx', reasons: ['High velocity', 'Geo anomaly'], velocity: 8, recurring: false },
  { id: 'TX-1039', amount: 59.99, currency: 'GBP', merchant: 'Spotify', category: 'Subscription', device: 'Mobile', location: 'London, GB', date: '2026-08-17', time: '14:21', status: 'safe', riskScore: 8, account: '••5512', ip: '82.19.xx.xx', reasons: [], velocity: 1, recurring: true },
  { id: 'TX-1038', amount: 3100, currency: 'USD', merchant: 'ATM Cash Advance', category: 'ATM', device: 'Unknown', location: 'Cancún, MX', date: '2026-08-17', time: '14:21', status: 'fraud', riskScore: 88, account: '••3308', ip: '187.2.xx.xx', reasons: ['Unknown device', 'Night transaction', 'Geo anomaly'], velocity: 9, recurring: false },
  { id: 'TX-1037', amount: 445.20, currency: 'USD', merchant: 'Best Buy', category: 'Purchase', device: 'PC', location: 'Austin, US', date: '2026-08-17', time: '14:20', status: 'safe', riskScore: 47, account: '••6614', ip: '68.13.xx.xx', reasons: ['Amount above average'], velocity: 5, recurring: false },
  { id: 'TX-1036', amount: 12.50, currency: 'USD', merchant: 'Uber Eats', category: 'Purchase', device: 'Mobile', location: 'NYC, US', date: '2026-08-17', time: '14:20', status: 'safe', riskScore: 6, account: '••9023', ip: '73.4.xx.xx', reasons: [], velocity: 3, recurring: false },
  { id: 'TX-1035', amount: 7280, currency: 'USD', merchant: 'FX Broker Ltd', category: 'Investment', device: 'Unknown', location: 'Panama City, PA', date: '2026-08-17', time: '14:19', status: 'fraud', riskScore: 91, account: '••1177', ip: '186.5.xx.xx', reasons: ['High risk country', 'Unknown device', 'Unusual amount', 'High velocity'], velocity: 14, recurring: false },
  { id: 'TX-1034', amount: 199.99, currency: 'USD', merchant: 'Adobe Creative', category: 'Subscription', device: 'PC', location: 'Seattle, US', date: '2026-08-16', time: '09:14', status: 'safe', riskScore: 11, account: '••2211', ip: '50.2.xx.xx', reasons: [], velocity: 1, recurring: true },
  { id: 'TX-1033', amount: 850, currency: 'USD', merchant: 'Coinbase', category: 'Crypto', device: 'Mobile', location: 'San Francisco, US', date: '2026-08-16', time: '18:42', status: 'safe', riskScore: 38, account: '••8844', ip: '104.12.xx.xx', reasons: ['Crypto purchase'], velocity: 3, recurring: false },
  { id: 'TX-1032', amount: 15000, currency: 'USD', merchant: 'International Wire', category: 'Transfer', device: 'Unknown', location: 'Bucharest, RO', date: '2026-08-16', time: '03:17', status: 'fraud', riskScore: 97, account: '••3301', ip: '89.4.xx.xx', reasons: ['Night transaction', 'Max amount', 'Unknown device', 'High risk country', 'Geo anomaly'], velocity: 18, recurring: false },
  { id: 'TX-1031', amount: 32.00, currency: 'USD', merchant: 'Netflix', category: 'Subscription', device: 'Mobile', location: 'Chicago, US', date: '2026-08-16', time: '11:00', status: 'safe', riskScore: 5, account: '••6677', ip: '73.8.xx.xx', reasons: [], velocity: 1, recurring: true },
  { id: 'TX-1030', amount: 2400, currency: 'EUR', merchant: 'Luxury Watch Co', category: 'Purchase', device: 'Tablet', location: 'Paris, FR', date: '2026-08-15', time: '15:30', status: 'safe', riskScore: 29, account: '••9911', ip: '2.5.xx.xx', reasons: [], velocity: 2, recurring: false },
  { id: 'TX-1029', amount: 4500, currency: 'USD', merchant: 'Gift Cards Bulk', category: 'Purchase', device: 'PC', location: 'Houston, US', date: '2026-08-15', time: '22:45', status: 'fraud', riskScore: 86, account: '••5544', ip: '72.14.xx.xx', reasons: ['Night transaction', 'Gift card purchase', 'High amount'], velocity: 7, recurring: false },
  { id: 'TX-1028', amount: 75, currency: 'USD', merchant: 'Whole Foods', category: 'Purchase', device: 'Mobile', location: 'Boston, US', date: '2026-08-15', time: '13:20', status: 'safe', riskScore: 7, account: '••1234', ip: '70.3.xx.xx', reasons: [], velocity: 2, recurring: false },
]

export const FRAUD_TREND = [
  { date: 'Aug 10', total: 1820, fraud: 38, rate: 2.09 },
  { date: 'Aug 11', total: 2140, fraud: 41, rate: 1.92 },
  { date: 'Aug 12', total: 1980, fraud: 35, rate: 1.77 },
  { date: 'Aug 13', total: 2450, fraud: 52, rate: 2.12 },
  { date: 'Aug 14', total: 2890, fraud: 49, rate: 1.70 },
  { date: 'Aug 15', total: 3120, fraud: 62, rate: 1.99 },
  { date: 'Aug 16', total: 3450, fraud: 58, rate: 1.68 },
  { date: 'Aug 17', total: 2560, fraud: 47, rate: 1.84 },
]

export const FRAUD_BY_DEVICE = [
  { device: 'PC', fraud: 38, total: 1240 },
  { device: 'Mobile', fraud: 22, total: 890 },
  { device: 'Tablet', fraud: 8, total: 310 },
  { device: 'Unknown', fraud: 74, total: 120 },
]

export const FRAUD_BY_TYPE = [
  { type: 'Crypto', fraud: 48, safe: 12 },
  { type: 'Transfer', fraud: 42, safe: 210 },
  { type: 'ATM', fraud: 31, safe: 88 },
  { type: 'Purchase', fraud: 28, safe: 1240 },
  { type: 'Investment', fraud: 19, safe: 44 },
  { type: 'Subscription', fraud: 2, safe: 480 },
]

export const RISK_DIST = [
  { label: 'Safe (0–25)', count: 18420, color: '#10b981' },
  { label: 'Low (26–50)', count: 4210, color: '#38bdf8' },
  { label: 'Medium (51–74)', count: 1890, color: '#f59e0b' },
  { label: 'High (75–89)', count: 842, color: '#f97316' },
  { label: 'Critical (90–100)', count: 314, color: '#ef4444' },
]

export function riskLevel(score: number): RiskLevel {
  if (score >= 90) return 'critical'
  if (score >= 75) return 'high'
  if (score >= 51) return 'medium'
  return 'safe'
}

export function riskColor(score: number) {
  const l = riskLevel(score)
  return { safe: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' }[l]
}
