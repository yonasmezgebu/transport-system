import React, { useState } from 'react'
import api from '../../services/api'

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
    <div>
      <div className="card">
        <div className="card-header">
          <h2>📊 University Administration Reports</h2>
          <p>Monitor transport operations, finances, and driver performance</p>
        </div>

        <div className="filters">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="start_date"
              className="form-input"
              value={dateRange.start_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="end_date"
              className="form-input"
              value={dateRange.end_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="tabs" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          <button
            className={`btn ${activeTab === 'operational' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('operational')}
          >
            📈 Operational Report
          </button>
          <button
            className={`btn ${activeTab === 'financial' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('financial')}
          >
            💰 Financial Report
          </button>
          <button
            className={`btn ${activeTab === 'driver' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('driver')}
          >
            👨‍✈️ Driver Performance
          </button>
        </div>

        <div className="form-actions" style={{ marginTop: '1rem' }}>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Operational Report */}
      {activeTab === 'operational' && operationalReport && (
        <div className="card">
          <div className="card-header">
            <h3>📈 Operational Report</h3>
            <button className="btn btn-sm btn-outline" onClick={() => exportToCSV([operationalReport.summary, ...operationalReport.route_breakdown], 'operational_report')}>
              Export CSV
            </button>
          </div>
          
          <div className="grid">
            <div className="stat-card" style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
              <h4>Total Trips</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#065f46' }}>{operationalReport.summary?.total_trips || 0}</p>
            </div>
            <div className="stat-card" style={{ padding: '1rem', background: '#dbeafe', borderRadius: '8px', textAlign: 'center' }}>
              <h4>Completed Trips</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>{operationalReport.summary?.completed_trips || 0}</p>
            </div>
            <div className="stat-card" style={{ padding: '1rem', background: '#fed7aa', borderRadius: '8px', textAlign: 'center' }}>
              <h4>Cancelled Trips</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#92400e' }}>{operationalReport.summary?.cancelled_trips || 0}</p>
            </div>
            <div className="stat-card" style={{ padding: '1rem', background: '#f1f5f9', borderRadius: '8px', textAlign: 'center' }}>
              <h4>Completion Rate</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{operationalReport.summary?.completion_rate || 0}%</p>
            </div>
          </div>
          
          <h4 style={{ marginTop: '1.5rem' }}>Route Breakdown</h4>
          <table className="table">
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '100px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, background: '#1a56db', height: '8px' }}></div>
                        </div>
                        <span>{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Financial Report */}
      {activeTab === 'financial' && financialReport && (
        <div className="card">
          <div className="card-header">
            <h3>💰 Financial Report</h3>
            <button className="btn btn-sm btn-outline" onClick={() => exportToCSV([financialReport.fuel, financialReport.maintenance], 'financial_report')}>
              Export CSV
            </button>
          </div>
          
          <div className="grid">
            <div className="stat-card" style={{ padding: '1rem', background: '#fef3c7', borderRadius: '8px', textAlign: 'center' }}>
              <h4>⛽ Total Fuel Cost</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400e' }}>ETB {financialReport.fuel?.total_fuel_cost?.toLocaleString() || 0}</p>
              <p>Total Liters: {financialReport.fuel?.total_liters?.toLocaleString() || 0} L</p>
            </div>
            <div className="stat-card" style={{ padding: '1rem', background: '#e0e7ff', borderRadius: '8px', textAlign: 'center' }}>
              <h4>🔧 Total Maintenance Cost</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3730a3' }}>ETB {financialReport.maintenance?.total_maintenance_cost?.toLocaleString() || 0}</p>
            </div>
            <div className="stat-card" style={{ padding: '1rem', background: '#dcfce7', borderRadius: '8px', textAlign: 'center' }}>
              <h4>💰 Grand Total</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>ETB {financialReport.total?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Driver Performance Report */}
      {activeTab === 'driver' && driverReport && (
        <div className="card">
          <div className="card-header">
            <h3>👨‍✈️ Driver Performance Report</h3>
            <button className="btn btn-sm btn-outline" onClick={() => exportToCSV(driverReport, 'driver_performance')}>
              Export CSV
            </button>
          </div>
          
          <table className="table">
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
                    <span style={{ color: '#ff9800' }}>
                      {'★'.repeat(Math.round(driver.avg_rating || 0))}
                      {'☆'.repeat(5 - Math.round(driver.avg_rating || 0))}
                    </span>
                    <span style={{ marginLeft: '0.5rem' }}>({driver.avg_rating?.toFixed(1) || 0})</span>
                  </td>
                  <td>{driver.total_hours || 0} hrs</td>
                  <td>
                    {driver.avg_rating >= 4 ? (
                      <span className="badge badge-success">Excellent</span>
                    ) : driver.avg_rating >= 3 ? (
                      <span className="badge badge-info">Good</span>
                    ) : driver.avg_rating >= 2 ? (
                      <span className="badge badge-warning">Needs Improvement</span>
                    ) : (
                      <span className="badge badge-danger">Poor</span>
                    )}
                  </td>
                </tr>
              ))}
              {driverReport.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No driver data available for this period</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {loading && <div className="loading-spinner">Generating report...</div>}

      {!operationalReport && !financialReport && !driverReport && !loading && (
        <div className="card">
          <div className="alert alert-info">
            <strong>📋 Instructions:</strong>
            <ul style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
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