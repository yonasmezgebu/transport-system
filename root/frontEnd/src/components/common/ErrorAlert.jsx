import React from 'react'

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null
  
  return (
    <div className="alert alert-danger">
      <span>{message}</span>
      {onClose && (
        <button 
          onClick={onClose} 
          className="btn-close"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            marginLeft: '1rem'
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}

export default ErrorAlert