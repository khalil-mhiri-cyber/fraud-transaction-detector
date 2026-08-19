import { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';
import api from '../services/api';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  async function fetchTransactions() {
    try {
      const data = await getTransactions();
      console.log(`✓ Loaded ${data.length} transactions from backend API`);
      
      const mappedData = data.map((t) => {
        const isFraud = t.is_fraud === true || t.isFraud === true || t.fraud === true;
        const fraudProb = t.fraud_probability || t.fraudProbability || 0;
        const riskScore = Math.round(fraudProb * 100);
        const finalRiskScore = isFraud && riskScore === 0 ? 85 : riskScore;
        
        // Admin status logic: use backend value or default for fraud
        let adminStatus = t.admin_status || t.adminStatus || null;
        if (adminStatus === null && isFraud) {
          adminStatus = 'PENDING';
        }
        
        return {
          id: t.id,
          amount: Math.round(Number(t.amount)),
          type: t.type || 'Transaction',
          device: t.device,
          location: t.place,
          timestamp: new Date(t.time).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          }),
          status: isFraud ? 'fraud' : 'normal',
          riskScore: finalRiskScore,
          adminStatus: adminStatus,
        };
      });
      
      // Debug: Log filter distribution
      const normalCount = mappedData.filter(t => t.status === 'normal').length;
      const fraudCount = mappedData.filter(t => t.status === 'fraud').length;
      const pendingCount = mappedData.filter(t => t.adminStatus === 'PENDING').length;
      console.log(`Filter counts: normal=${normalCount}, fraud=${fraudCount}, pending=${pendingCount}`);
      
      setTransactions(mappedData);
      setLoading(false);
    } catch (error) {
      console.error('✗ Error fetching transactions from backend:', error);
      console.error('Error details:', error.message);
      setTransactions([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
    // Refresh transactions every 5 seconds
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleReview = async (id, decision) => {
    try {
      await api.patch(`/transactions/${id}/review?decision=${decision}`);
      setTransactions(prev => prev.map(t =>
        t.id === id ? { ...t, adminStatus: decision } : t
      ));
    } catch (err) {
      console.error('Review failed:', err);
    }
  };

  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch =
        t.id.toString().includes(searchTerm) ||
        t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.location || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === 'normal') {
        matchesStatus = t.status === 'normal';
      } else if (statusFilter === 'fraud') {
        matchesStatus = t.status === 'fraud';
      } else if (statusFilter === 'pending') {
        matchesStatus = t.adminStatus === 'PENDING';
      } else {
        matchesStatus = true; // 'all'
      }
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const getRiskColor = (score) => {
    if (score >= 80) return '#ef4444';
    if (score >= 60) return '#f59e0b';
    return '#10b981';
  };

  const inputStyle = {
    padding: '8px 12px',
    background: 'rgba(8,13,26,0.6)',
    border: '1px solid rgba(148,163,184,0.12)',
    borderRadius: 4,
    fontFamily: 'Instrument Sans',
    fontSize: 13,
    color: '#e2e8f0',
    outline: 'none',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, color: '#64748b' }}>Loading transactions...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Instrument Sans', fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>
            Transactions
          </h1>
          <p style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
            {filteredTransactions.length} transaction(s) found • Page {currentPage} of {totalPages}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'Instrument Sans', fontSize: 12, color: '#64748b' }}>Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{
              ...inputStyle,
              cursor: 'pointer',
              paddingRight: 30
            }}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#0d1528', padding: '16px 20px', borderRadius: 4, border: '1px solid rgba(148,163,184,0.08)' }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search by ID, type, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'normal', 'fraud', 'pending'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '8px 16px',
                border: statusFilter === status ? '1px solid #f59e0b' : '1px solid rgba(148,163,184,0.12)',
                borderRadius: 4,
                background: statusFilter === status ? 'rgba(245,158,11,0.1)' : 'rgba(148,163,184,0.03)',
                color: statusFilter === status ? '#f59e0b' : '#94a3b8',
                fontFamily: 'Instrument Sans',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.15s'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#0d1528', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(148,163,184,0.03)', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                {[
                  { key: 'id', label: 'ID' },
                  { key: 'type', label: 'Type' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'device', label: 'Device' },
                  { key: 'location', label: 'Location' },
                  { key: 'timestamp', label: 'Date & Time' },
                  { key: 'status', label: 'AI Status' },
                  { key: 'riskScore', label: 'Risk' },
                  { key: 'adminStatus', label: 'Admin Decision' }
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontFamily: 'Instrument Sans',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {col.label}
                      {sortConfig.key === col.key && (
                        <span style={{ color: '#f59e0b' }}>
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((tx, idx) => (
                <tr
                  key={tx.id}
                  style={{
                    borderBottom: idx < paginatedTransactions.length - 1 ? '1px solid rgba(148,163,184,0.05)' : 'none',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(148,163,184,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
                    {tx.id}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'Instrument Sans', fontSize: 13, color: '#e2e8f0' }}>
                    {tx.type}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
                    {tx.amount.toLocaleString()} DT
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'Instrument Sans', fontSize: 13, color: '#94a3b8' }}>
                    {tx.device}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'Instrument Sans', fontSize: 13, color: '#94a3b8' }}>
                    {tx.location}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>
                    {tx.timestamp}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontFamily: 'Instrument Sans',
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      background: tx.status === 'fraud' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                      color: tx.status === 'fraud' ? '#ef4444' : '#10b981',
                      border: `1px solid ${tx.status === 'fraud' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`
                    }}>
                      {tx.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(148,163,184,0.1)', overflow: 'hidden', minWidth: 60 }}>
                        <div style={{
                          width: `${tx.riskScore}%`,
                          height: '100%',
                          background: getRiskColor(tx.riskScore),
                          borderRadius: 3
                        }} />
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: getRiskColor(tx.riskScore), minWidth: 30 }}>
                        {tx.riskScore}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {tx.status === 'normal' ? (
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 12,
                        fontFamily: 'Instrument Sans', fontSize: 11, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                        background: 'rgba(16,185,129,0.15)',
                        color: '#10b981',
                        border: '1px solid rgba(16,185,129,0.3)',
                      }}>
                        AUTO-APPROVED
                      </span>
                    ) : tx.adminStatus === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handleReview(tx.id, 'APPROVED')}
                          style={{
                            padding: '4px 10px', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 4,
                            background: 'rgba(16,185,129,0.08)', color: '#10b981',
                            fontFamily: 'Instrument Sans', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                          }}
                        >✓ Approve</button>
                        <button
                          onClick={() => handleReview(tx.id, 'BLOCKED')}
                          style={{
                            padding: '4px 10px', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 4,
                            background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                            fontFamily: 'Instrument Sans', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                          }}
                        >✕ Block</button>
                      </div>
                    ) : (
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 12,
                        fontFamily: 'Instrument Sans', fontSize: 11, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                        background: tx.adminStatus === 'APPROVED' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: tx.adminStatus === 'APPROVED' ? '#10b981' : '#ef4444',
                        border: `1px solid ${tx.adminStatus === 'APPROVED' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      }}>
                        {tx.adminStatus}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Instrument Sans', fontSize: 14, color: '#64748b' }}>
              No transactions found matching your criteria
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: '#0d1528',
          border: '1px solid rgba(148,163,184,0.08)',
          borderRadius: 4
        }}>
          <div style={{ fontFamily: 'Instrument Sans', fontSize: 13, color: '#64748b' }}>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length}
          </div>
          
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                border: '1px solid rgba(148,163,184,0.12)',
                borderRadius: 4,
                background: currentPage === 1 ? 'rgba(148,163,184,0.05)' : 'rgba(148,163,184,0.03)',
                color: currentPage === 1 ? '#475569' : '#94a3b8',
                fontFamily: 'Instrument Sans',
                fontSize: 13,
                fontWeight: 600,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s'
              }}
            >
              First
            </button>
            
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                border: '1px solid rgba(148,163,184,0.12)',
                borderRadius: 4,
                background: currentPage === 1 ? 'rgba(148,163,184,0.05)' : 'rgba(148,163,184,0.03)',
                color: currentPage === 1 ? '#475569' : '#94a3b8',
                fontFamily: 'Instrument Sans',
                fontSize: 13,
                fontWeight: 600,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Previous
            </button>

            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      padding: '8px 12px',
                      border: currentPage === pageNum ? '1px solid #f59e0b' : '1px solid rgba(148,163,184,0.12)',
                      borderRadius: 4,
                      background: currentPage === pageNum ? 'rgba(245,158,11,0.1)' : 'rgba(148,163,184,0.03)',
                      color: currentPage === pageNum ? '#f59e0b' : '#94a3b8',
                      fontFamily: 'JetBrains Mono',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      minWidth: 36,
                      transition: 'all 0.15s'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 12px',
                border: '1px solid rgba(148,163,184,0.12)',
                borderRadius: 4,
                background: currentPage === totalPages ? 'rgba(148,163,184,0.05)' : 'rgba(148,163,184,0.03)',
                color: currentPage === totalPages ? '#475569' : '#94a3b8',
                fontFamily: 'Instrument Sans',
                fontSize: 13,
                fontWeight: 600,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Next
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 12px',
                border: '1px solid rgba(148,163,184,0.12)',
                borderRadius: 4,
                background: currentPage === totalPages ? 'rgba(148,163,184,0.05)' : 'rgba(148,163,184,0.03)',
                color: currentPage === totalPages ? '#475569' : '#94a3b8',
                fontFamily: 'Instrument Sans',
                fontSize: 13,
                fontWeight: 600,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
