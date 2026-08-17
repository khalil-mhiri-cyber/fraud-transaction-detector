export function riskLevel(score) {
  if (score >= 90) return 'critical'
  if (score >= 75) return 'high'
  if (score >= 51) return 'medium'
  return 'safe'
}

export function riskColor(score) {
  const l = riskLevel(score)
  return { safe: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' }[l]
}
