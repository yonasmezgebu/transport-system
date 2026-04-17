// Email Validation
export const validateEmail = (email) => {
  if (!email) return { valid: false, message: 'Email is required' }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(email)) return { valid: false, message: 'Please enter a valid email address' }
  return { valid: true, message: '' }
}

// Password Validation
export const validatePassword = (password) => {
  if (!password) return { valid: false, message: 'Password is required' }
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' }
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Password must contain at least one number' }
  if (!/[!@#$%^&*]/.test(password)) return { valid: false, message: 'Password must contain at least one special character (!@#$%^&*)' }
  return { valid: true, message: '' }
}

// Phone Validation
export const validatePhone = (phone) => {
  if (!phone) return { valid: true, message: '' } // Optional
  const re = /^[0-9]{9,10}$/
  if (!re.test(phone)) return { valid: false, message: 'Please enter a valid phone number (9-10 digits)' }
  return { valid: true, message: '' }
}

// Required Field
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || value.toString().trim() === '') {
    return { valid: false, message: `${fieldName} is required` }
  }
  return { valid: true, message: '' }
}

// Number Validation
export const validateNumber = (value, min = null, max = null) => {
  const num = parseFloat(value)
  if (isNaN(num)) return { valid: false, message: 'Must be a valid number' }
  if (min !== null && num < min) return { valid: false, message: `Must be at least ${min}` }
  if (max !== null && num > max) return { valid: false, message: `Must be at most ${max}` }
  return { valid: true, message: '' }
}

// Positive Number
export const validatePositiveNumber = (value) => {
  const num = parseFloat(value)
  if (isNaN(num)) return { valid: false, message: 'Must be a valid number' }
  if (num <= 0) return { valid: false, message: 'Must be greater than zero' }
  return { valid: true, message: '' }
}

// Date Validation
export const validateDate = (date, allowPast = true) => {
  if (!date) return { valid: false, message: 'Date is required' }
  const d = new Date(date)
  if (isNaN(d.getTime())) return { valid: false, message: 'Please enter a valid date' }
  
  if (!allowPast) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (d < today) return { valid: false, message: 'Date cannot be in the past' }
  }
  return { valid: true, message: '' }
}

// Time Validation
export const validateTime = (time) => {
  if (!time) return { valid: false, message: 'Time is required' }
  const re = /^([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
  if (!re.test(time)) return { valid: false, message: 'Please enter a valid time (HH:MM)' }
  return { valid: true, message: '' }
}

// License Plate Validation
export const validateLicensePlate = (plate) => {
  if (!plate) return { valid: false, message: 'License plate is required' }
  const re = /^[A-Z]{2}-\d{4}$/i
  if (!re.test(plate)) return { valid: false, message: 'Format: AA-1234' }
  return { valid: true, message: '' }
}

// Capacity Validation
export const validateCapacity = (capacity) => {
  const num = parseInt(capacity)
  if (isNaN(num)) return { valid: false, message: 'Capacity must be a number' }
  if (num < 1) return { valid: false, message: 'Capacity must be at least 1' }
  if (num > 60) return { valid: false, message: 'Capacity cannot exceed 60' }
  return { valid: true, message: '' }
}

// Rating Validation
export const validateRating = (rating) => {
  const num = parseInt(rating)
  if (isNaN(num)) return { valid: false, message: 'Rating is required' }
  if (num < 1 || num > 5) return { valid: false, message: 'Rating must be between 1 and 5' }
  return { valid: true, message: '' }
}

// Fuel Validation
export const validateFuelLog = (liters, cost, mileage, previousMileage = null) => {
  const errors = []
  
  const litersValid = validatePositiveNumber(liters)
  if (!litersValid.valid) errors.push(litersValid.message)
  
  const costValid = validatePositiveNumber(cost)
  if (!costValid.valid) errors.push(costValid.message)
  
  const mileageValid = validatePositiveNumber(mileage)
  if (!mileageValid.valid) errors.push(mileageValid.message)
  
  if (previousMileage !== null && parseFloat(mileage) <= previousMileage) {
    errors.push(`Mileage must be greater than previous reading (${previousMileage})`)
  }
  
  return { valid: errors.length === 0, errors }
}

// Form Validation Helper
export const validateForm = (data, rules) => {
  const errors = {}
  let isValid = true
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field]
    const result = rule(value)
    if (!result.valid) {
      errors[field] = result.message
      isValid = false
    }
  }
  
  return { isValid, errors }
}