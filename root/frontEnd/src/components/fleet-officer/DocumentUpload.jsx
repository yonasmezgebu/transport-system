import React, { useState, useEffect } from 'react'
import api from '../../services/api'

const DocumentUpload = () => {
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [documentType, setDocumentType] = useState('insurance')
  const [file, setFile] = useState(null)
  const [expiryDate, setExpiryDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles')
      setVehicles(response.data)
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setMessage('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedVehicle) {
      setError('Please select a vehicle')
      return
    }
    if (!file) {
      setError('Please select a file')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    const formData = new FormData()
    formData.append('vehicle_id', selectedVehicle)
    formData.append('document_type', documentType)
    formData.append('expiry_date', expiryDate)
    formData.append('document', file)

    try {
      await api.post('/vehicles/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage('Document uploaded successfully!')
      setFile(null)
      setExpiryDate('')
      setDocumentType('insurance')
      // Reset file input
      document.getElementById('fileInput').value = ''
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to upload document')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Upload Vehicle Documents</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid">
          <div className="form-group">
            <label className="form-label">Select Vehicle *</label>
            <select
              className="form-select"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                  {vehicle.registration_number} - {vehicle.model}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Document Type *</label>
            <select
              className="form-select"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              required
            >
              <option value="insurance">Insurance Certificate</option>
              <option value="inspection">Inspection Certificate</option>
              <option value="registration">Registration Certificate</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Expiry Date *</label>
            <input
              type="date"
              className="form-input"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Document File * (PDF, JPG, PNG)</label>
            <input
              type="file"
              id="fileInput"
              className="form-input"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>

      <hr style={{ margin: '2rem 0' }} />

      <div className="card-header">
        <h3>Uploaded Documents</h3>
      </div>
      <div className="alert alert-info">
        <p>Documents uploaded will appear here with expiry tracking.</p>
        <p>Expiring documents trigger alerts 30 days before expiry.</p>
      </div>
    </div>
  )
}

export default DocumentUpload