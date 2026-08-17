// Mock data for development
export const TRANSACTIONS = [
  {
    id: 'TX-9247',
    amount: 8500,
    merchant: 'Global Electronics',
    location: 'Singapore',
    time: '14:32',
    status: 'fraud',
    riskScore: 94,
  },
  {
    id: 'TX-9245',
    amount: 12300,
    merchant: 'Luxury Watches',
    location: 'Dubai',
    time: '13:15',
    status: 'fraud',
    riskScore: 89,
  },
  {
    id: 'TX-9243',
    amount: 4200,
    merchant: 'Fashion Store',
    location: 'London',
    time: '12:48',
    status: 'fraud',
    riskScore: 87,
  },
  {
    id: 'TX-9240',
    amount: 15600,
    merchant: 'Tech Gadgets',
    location: 'Tokyo',
    time: '11:22',
    status: 'fraud',
    riskScore: 92,
  },
  {
    id: 'TX-9238',
    amount: 6700,
    merchant: 'Online Marketplace',
    location: 'Berlin',
    time: '10:05',
    status: 'fraud',
    riskScore: 85,
  },
];

export const FRAUD_TREND = [
  { date: 'Aug 10', total: 3200, fraud: 52 },
  { date: 'Aug 11', total: 3450, fraud: 48 },
  { date: 'Aug 12', total: 3100, fraud: 55 },
  { date: 'Aug 13', total: 3800, fraud: 62 },
  { date: 'Aug 14', total: 3600, fraud: 58 },
  { date: 'Aug 15', total: 3900, fraud: 51 },
  { date: 'Aug 16', total: 3750, fraud: 46 },
  { date: 'Aug 17', total: 4100, fraud: 47 },
];

export const riskColor = (score) => {
  if (score >= 80) return '#ef4444';
  if (score >= 60) return '#f59e0b';
  return '#10b981';
};
