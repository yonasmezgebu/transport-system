import React, { useState } from 'react'
import api from '../../services/api'

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  })
  const [operationalReport, setOperationalReport] = useState(null)
  const [financialReport, setFinancialReport] = useState(null)
  const [loading, setLoading] = useState(false)

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

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Reports Dashboard</h2>
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

        <div className="form-actions">
          <button 
            className="btn btn-primary" 
            onClick={generateOperationalReport}
            disabled={loading}
          >
            Generate Operational Report
          </button>
          <button 
            className="btn btn-primary" 
            onClick={generateFinancialReport}
            disabled={loading}
          >
            Generate Financial Report
          </button>
        </div>
      </div>

      {operationalReport && (
        <div className="card">
          <div className="card-header">
            <h3>Operational Report</h3>
          </div>
          <div className="grid">
            <div className="stat-card">
              <h4>Total Trips</h4>
              <p className="stat-number">{operationalReport.summary?.total_trips || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Completed Trips</h4>
              <p className="stat-number">{operationalReport.summary?.completed_trips || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Cancelled Trips</h4>
              <p className="stat-number">{operationalReport.summary?.cancelled_trips || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Completion Rate</h4>
              <p className="stat-number">{operationalReport.summary?.completion_rate || 0}%</p>
            </div>
          </div>
          
          <h4>Route Breakdown</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Trip Count</th>
              </tr>
            </thead>
            <tbody>
              {operationalReport.route_breakdown?.map((route, index) => (
                <tr key={index}>
                  <td>{route.route}</td>
                  <td>{route.trip_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {financialReport && (
        <div className="card">
          <div className="card-header">
            <h3>Financial Report</h3>
          </div>
          <div className="grid">
            <div className="stat-card">
              <h4>Total Fuel Cost</h4>
              <p className="stat-number">ETB {financialReport.fuel?.total_fuel_cost?.toLocaleString() || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Total Fuel Liters</h4>
              <p className="stat-number">{financialReport.fuel?.total_liters || 0} L</p>
            </div>
            <div className="stat-card">
              <h4>Total Maintenance Cost</h4>
              <p className="stat-number">ETB {financialReport.maintenance?.total_maintenance_cost?.toLocaleString() || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Grand Total</h4>
              <p className="stat-number">ETB {financialReport.total?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="loading-spinner">Generating report...</div>}
    </div>
  )
}

export default Reports