/**
 * Shared utility functions for transaction status determination
 * Ensures consistent logic across admin and user interfaces
 */

/**
 * Determine the status of a transaction based on admin decision and fraud detection
 * @param {Object} tx - Transaction object
 * @returns {string} - 'approved', 'blocked', 'pending', or 'flagged'
 */
export function getTransactionStatus(tx) {
  // Admin decision is ALWAYS the final word
  if (tx.adminStatus === 'APPROVED' || tx.admin_status === 'APPROVED') {
    return 'approved';
  }
  
  if (tx.adminStatus === 'BLOCKED' || tx.admin_status === 'BLOCKED') {
    return 'blocked';
  }
  
  if (tx.adminStatus === 'PENDING' || tx.admin_status === 'PENDING') {
    return 'pending';
  }
  
  // No admin decision yet - check fraud detection
  const isFraud = tx.is_fraud === true || tx.isFraud === true || tx.fraud === true;
  
  // If flagged as fraud but no admin decision → pending review
  if (isFraud) {
    return 'pending';
  }
  
  // Not fraud and no admin block → auto-approved
  return 'approved';
}

/**
 * Get descriptive note for transaction status
 * @param {Object} tx - Transaction object
 * @returns {string} - Human-readable status note
 */
export function getStatusNote(tx) {
  const status = getTransactionStatus(tx);
  
  switch (status) {
    case 'blocked':
      return 'Blocked by fraud system';
    case 'flagged':
      return 'Flagged for review';
    case 'pending':
      return 'Awaiting review';
    case 'approved':
      return 'Approved';
    default:
      return '';
  }
}

/**
 * Check if a transaction is fraud based on backend data
 * @param {Object} tx - Transaction object
 * @returns {boolean}
 */
export function isFraudTransaction(tx) {
  return tx.is_fraud === true || tx.isFraud === true || tx.fraud === true;
}

/**
 * Get fraud probability as percentage
 * @param {Object} tx - Transaction object
 * @returns {number} - Risk score 0-100
 */
export function getRiskScore(tx) {
  const fraudProb = tx.fraud_probability || tx.fraudProbability || 0;
  const score = Math.round(fraudProb * 100);
  
  // If marked as fraud but no probability, assign high default score
  if (isFraudTransaction(tx) && score === 0) {
    return 85;
  }
  
  return score;
}

/**
 * Determine if transaction needs admin action
 * @param {Object} tx - Transaction object
 * @returns {boolean}
 */
export function needsAdminAction(tx) {
  const status = getTransactionStatus(tx);
  return status === 'pending';
}
