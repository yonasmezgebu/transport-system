import React, { useState } from 'react'
import api from '../../services/api'
import styles from '../../styles/AdminDashboard.module.css'

const AdminReports = () => {
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  })
  const [operationalReport, setOperationalReport] = useState(null)
  const [financialReport, setFinancialReport] = useState(null)
  const [driverReport, setDriverReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('operational')

  const handleChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    })
  }

  const generateOperationalReport = async () => {
    if (!dateRange.start_date || !dateRange.end_date) {
      alert('Please select both start and end dates')
      return
    }
    
    setLoading(true)
    try {
      const response = await api.get('/reports/operational', { 
        params: { start_date: dateRange.start_date, end_date: dateRange.end_date }
      })
      setOperationalReport(response.data)
    } catch (error) {
      alert('Failed to generate operational report')
    } finally {
      setLoading(false)
    }
  }

  const generateFinancialReport = async () => {
    if (!dateRange.start_date || !dateRange.end_date) {
      alert('Please select both start and end dates')
      return
    }
    
    setLoading(true)
    try {
      const response = await api.get('/reports/financial', { 
        params: { start_date: dateRange.start_date, end_date: dateRange.end_date }
      })
      setFinancialReport(response.data)
    } catch (error) {
      alert('Failed to generate financial report')
    } finally {
      setLoading(false)
    }
  }

  const generateDriverReport = async () => {
    if (!dateRange.start_date || !dateRange.end_date) {
      alert('Please select both start and end dates')
      return
    }
    
    setLoading(true)
    try {
      const response = await api.get('/reports/drivers', { 
        params: { start_date: dateRange.start_date, end_date: dateRange.end_date }
      })
      setDriverReport(response.data)
    } catch (error) {
      alert('Failed to generate driver performance report')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = () => {
    if (activeTab === 'operational') generateOperationalReport()
    if (activeTab === 'financial') generateFinancialReport()
    if (activeTab === 'driver') generateDriverReport()
  }

  const exportToCSV = (data, filename) => {
    if (!data) return
    const items = Array.isArray(data) ? data : [data]
    const headers = Object.keys(items[0] || {})
    const csvContent = [
      headers.join(','),
      ...items.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>📊 University Administration Reports</h2>
            <p>Monitor transport operations, finances, and driver performance</p>
          </div>
        </div>

        <div className={styles.filtersGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Start Date</label>
            <input
              type="date"
              name="start_date"
              className={styles.formInput}
              value={dateRange.start_date}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>End Date</label>
            <input
              type="date"
              name="end_date"
              className={styles.formInput}
              value={dateRange.end_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={activeTab === 'operational' ? styles.btnPrimary : styles.btnOutline}
            onClick={() => setActiveTab('operational')}
          >
            📈 Operational Report
          </button>
          <button
            className={activeTab === 'financial' ? styles.btnPrimary : styles.btnOutline}
            onClick={() => setActiveTab('financial')}
          >
            💰 Financial Report
          </button>
          <button
            className={activeTab === 'driver' ? styles.btnPrimary : styles.btnOutline}
            onClick={() => setActiveTab('driver')}
          >
            👨‍✈️ Driver Performance
          </button>
        </div>

        <div>
          <button className={styles.btnPrimary} onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Operational Report */}
      {activeTab === 'operational' && operationalReport && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>📈 Operational Report</h3>
            <button className={styles.btnOutline} onClick={() => exportToCSV([operationalReport.summary, ...operationalReport.route_breakdown], 'operational_report')}>
              Export CSV
            </button>
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard} style={{ background: '#f0fdf4' }}>
              <h4>Total Trips</h4>
              <p style={{ color: '#065f46' }}>{operationalReport.summary?.total_trips || 0}</p>
            </div>
            <div className={styles.statCard} style={{ background: '#dbeafe' }}>
              <h4>Completed Trips</h4>
              <p style={{ color: '#1e40af' }}>{operationalReport.summary?.completed_trips || 0}</p>
            </div>
            <div className={styles.statCard} style={{ background: '#ffedd5' }}>
              <h4>Cancelled Trips</h4>
              <p style={{ color: '#9a3412' }}>{operationalReport.summary?.cancelled_trips || 0}</p>
            </div>
            <div className={styles.statCard} style={{ background: '#f1f5f9' }}>
              <h4>Completion Rate</h4>
              <p style={{ color: '#0f172a' }}>{operationalReport.summary?.completion_rate || 0}%</p>
            </div>
          </div>
          
          <h4 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#1e293b' }}>Route Breakdown</h4>
          <div className={styles.tableContainer}>
            <table className={styles.modernTable}>
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Trip Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {operationalReport.route_breakdown?.map((route, index) => {
                  const total = operationalReport.summary?.total_trips || 1
                  const percentage = ((route.trip_count / total) * 100).toFixed(1)
                  return (
                    <tr key={index}>
                      <td>{route.route}</td>
                      <td>{route.trip_count}</td>
                      <td>
                        <div className={styles.progressContainer}>
                          <div className={styles.progressBarTrack}>
                            <div className={styles.progressBarFill} style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: '500', minWidth: '45px' }}>{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Financial Report */}
      {activeTab === 'financial' && financialReport && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>💰 Financial Report</h3>
            <button className={styles.btnOutline} onClick={() => exportToCSV([financialReport.fuel, financialReport.maintenance], 'financial_report')}>
              Export CSV
            </button>
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard} style={{ background: '#fef3c7' }}>
              <h4>⛽ Total Fuel Cost</h4>
              <p style={{ fontSize: '1.5rem', color: '#92400e' }}>ETB {financialReport.fuel?.total_fuel_cost?.toLocaleString() || 0}</p>
              <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#b45309' }}>Total Liters: {financialReport.fuel?.total_liters?.toLocaleString() || 0} L</div>
            </div>
            <div className={styles.statCard} style={{ background: '#e0e7ff' }}>
              <h4>🔧 Total Maintenance Cost</h4>
              <p style={{ fontSize: '1.5rem', color: '#3730a3' }}>ETB {financialReport.maintenance?.total_maintenance_cost?.toLocaleString() || 0}</p>
            </div>
            <div className={styles.statCard} style={{ background: '#dcfce7' }}>
              <h4>💰 Grand Total</h4>
              <p style={{ fontSize: '1.5rem', color: '#166534' }}>ETB {financialReport.total?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Driver Performance Report */}
      {activeTab === 'driver' && driverReport && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>👨‍✈️ Driver Performance Report</h3>
            <button className={styles.btnOutline} onClick={() => exportToCSV(driverReport, 'driver_performance')}>
              Export CSV
            </button>
          </div>
          
          <div className={styles.tableContainer}>
            <table className={styles.modernTable}>
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>Trips Completed</th>
                  <th>Average Rating</th>
                  <th>Total Hours</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {driverReport.map((driver, index) => (
                  <tr key={index}>
                    <td><strong>{driver.full_name}</strong></td>
                    <td>{driver.trips_completed || 0}</td>
                    <td>
                      <span style={{ color: '#f59e0b', fontSize: '1.2rem', letterSpacing: '2px' }}>
                        {'★'.repeat(Math.round(driver.avg_rating || 0))}
                        <span style={{ color: '#e2e8f0' }}>{'★'.repeat(5 - Math.round(driver.avg_rating || 0))}</span>
                      </span>
                      <span style={{ marginLeft: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>({driver.avg_rating?.toFixed(1) || 0})</span>
                    </td>
                    <td>{driver.total_hours || 0} hrs</td>
                    <td>
                      {driver.avg_rating >= 4 ? (
                        <span className={`${styles.badge} ${styles.badgeSuccess}`}>Excellent</span>
                      ) : driver.avg_rating >= 3 ? (
                        <span className={`${styles.badge} ${styles.badgeInfo}`}>Good</span>
                      ) : driver.avg_rating >= 2 ? (
                        <span className={`${styles.badge} ${styles.badgeWarning}`}>Needs Improvement</span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgeDanger}`}>Poor</span>
                      )}
                    </td>
                  </tr>
                ))}
                {driverReport.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No driver data available for this period</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading && <div className={styles.loadingSpinner}>Generating report...</div>}

      {!operationalReport && !financialReport && !driverReport && !loading && (
        <div className={styles.card}>
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <strong>📋 Instructions:</strong>
            <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li>Select a date range to generate reports</li>
              <li>Operational Report: Shows trip statistics and route breakdown</li>
              <li>Financial Report: Shows fuel and maintenance costs</li>
              <li>Driver Performance: Shows driver ratings and trip completion</li>
              <li>Export any report to CSV using the Export button</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReports