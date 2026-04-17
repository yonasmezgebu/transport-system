// Phone Number Formatter
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3')
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

// License Plate Formatter
export const formatLicensePlate = (plate) => {
  if (!plate) return ''
  return plate.toUpperCase().trim()
}

// Vehicle Model Formatter
export const formatVehicleModel = (model) => {
  if (!model) return ''
  return capitalizeWords(model)
}

// Driver Name Formatter
export const formatDriverName = (firstName, lastName) => {
  if (!firstName && !lastName) return ''
  if (!lastName) return capitalize(firstName)
  return `${capitalize(firstName)} ${capitalize(lastName)}`
}

// Route Formatter
export const formatRoute = (route) => {
  if (!route) return ''
  return route.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

// Status Formatter
export const formatStatus = (status) => {
  if (!status) return ''
  return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

// Date Formatter for Display
export const formatDateDisplay = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Time Formatter for Display
export const formatTimeDisplay = (time) => {
  if (!time) return 'N/A'
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

// DateTime Formatter
export const formatDateTimeDisplay = (date, time) => {
  if (!date) return 'N/A'
  return `${formatDateDisplay(date)} at ${formatTimeDisplay(time)}`
}

// Currency Formatter (ETB)
export const formatCurrencyETB = (amount) => {
  if (amount === null || amount === undefined) return 'ETB 0.00'
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Number Formatter
export const formatNumberDisplay = (num, decimals = 0) => {
  if (num === null || num === undefined) return '0'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num)
}

// Percentage Formatter
export const formatPercentageDisplay = (value, total, decimals = 1) => {
  if (!total || total === 0) return '0%'
  const percentage = (value / total) * 100
  return `${percentage.toFixed(decimals)}%`
}

// Distance Formatter (km)
export const formatDistance = (km) => {
  if (km === null || km === undefined) return '0 km'
  return `${formatNumberDisplay(km)} km`
}

// Fuel Efficiency Formatter
export const formatFuelEfficiency = (kmPerLiter) => {
  if (kmPerLiter === null || kmPerLiter === undefined) return 'N/A'
  return `${kmPerLiter.toFixed(1)} km/L`
}

// Duration Formatter
export const formatDuration = (hours) => {
  if (hours === null || hours === undefined) return '0 hrs'
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} hr${h > 1 ? 's' : ''}`
  return `${h} hr${h > 1 ? 's' : ''} ${m} min`
}

// File Size Formatter
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Rating Formatter (Stars)
export const formatRatingStars = (rating) => {
  const fullStars = '★'.repeat(Math.floor(rating))
  const halfStar = rating % 1 >= 0.5 ? '½' : ''
  const emptyStars = '☆'.repeat(5 - Math.ceil(rating))
  return `${fullStars}${halfStar}${emptyStars}`
}

// Address Formatter
export const formatAddress = (address) => {
  if (!address) return ''
  const parts = []
  if (address.street) parts.push(address.street)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  return parts.join(', ')
}

// Initials Formatter
export const getInitials = (fullName) => {
  if (!fullName) return ''
  return fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}