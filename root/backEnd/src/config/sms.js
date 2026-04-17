const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// SMS Gateway configuration
// This is a placeholder - implement with actual SMS provider API
const SMS_CONFIG = {
    provider: process.env.SMS_PROVIDER || 'ethio_telecom',
    apiKey: process.env.SMS_API_KEY,
    apiSecret: process.env.SMS_API_SECRET,
    senderId: process.env.SMS_SENDER_ID || 'InjibaraUni',
    baseUrl: process.env.SMS_BASE_URL || 'https://api.ethiotelecom.et/sms'
};

// Queue for retry mechanism
const smsQueue = [];
let isProcessingQueue = false;

// Send SMS with retry logic
const sendSMS = async (phoneNumber, message, retryCount = 0) => {
    // Validate phone number (Ethiopian format)
    let formattedNumber = formatPhoneNumber(phoneNumber);
    if (!formattedNumber) {
        console.error('Invalid phone number:', phoneNumber);
        return { success: false, error: 'Invalid phone number' };
    }

    try {
        // Build request payload based on provider
        let payload;
        let headers;

        switch (SMS_CONFIG.provider) {
            case 'ethio_telecom':
                payload = {
                    to: formattedNumber,
                    from: SMS_CONFIG.senderId,
                    text: message,
                    type: 'text'
                };
                headers = {
                    'Authorization': `Bearer ${SMS_CONFIG.apiKey}`,
                    'Content-Type': 'application/json'
                };
                break;
            case 'safaricom':
                payload = {
                    destination: formattedNumber,
                    source: SMS_CONFIG.senderId,
                    message: message
                };
                headers = {
                    'apiKey': SMS_CONFIG.apiKey,
                    'apiSecret': SMS_CONFIG.apiSecret,
                    'Content-Type': 'application/json'
                };
                break;
            default:
                // Mock SMS for development
                console.log(`[MOCK SMS] To: ${formattedNumber}, Message: ${message}`);
                return { success: true, messageId: `mock_${Date.now()}` };
        }

        // Send SMS
        const response = await axios.post(`${SMS_CONFIG.baseUrl}/send`, payload, { headers, timeout: 10000 });
        
        if (response.status === 200 || response.status === 201) {
            console.log(`SMS sent to ${formattedNumber}: ${message.substring(0, 50)}...`);
            return { success: true, messageId: response.data?.messageId || `sms_${Date.now()}` };
        } else {
            throw new Error(`SMS API returned ${response.status}`);
        }
    } catch (error) {
        console.error(`SMS sending failed (attempt ${retryCount + 1}):`, error.message);
        
        // Retry logic (max 3 retries)
        if (retryCount < 3) {
            const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, delay));
            return sendSMS(phoneNumber, message, retryCount + 1);
        }
        
        // Add to queue for later retry
        addToQueue(phoneNumber, message);
        
        return { success: false, error: error.message };
    }
};

// Format Ethiopian phone number
const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    
    // Remove any non-digit characters
    let cleaned = phone.toString().replace(/\D/g, '');
    
    // Ethiopian phone numbers: 9 digits starting with 09, or 12 digits starting with 251
    if (cleaned.length === 9 && cleaned.startsWith('9')) {
        return `251${cleaned}`;
    } else if (cleaned.length === 10 && cleaned.startsWith('09')) {
        return `251${cleaned.substring(1)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('251')) {
        return cleaned;
    }
    
    return null;
};

// Add failed SMS to queue
const addToQueue = (phoneNumber, message) => {
    smsQueue.push({
        phoneNumber,
        message,
        createdAt: new Date(),
        attempts: 0
    });
    
    // Process queue if not already processing
    if (!isProcessingQueue) {
        processQueue();
    }
};

// Process SMS queue
const processQueue = async () => {
    if (isProcessingQueue || smsQueue.length === 0) return;
    
    isProcessingQueue = true;
    
    while (smsQueue.length > 0) {
        const item = smsQueue.shift();
        item.attempts++;
        
        const result = await sendSMS(item.phoneNumber, item.message, 0);
        
        if (!result.success && item.attempts < 5) {
            // Re-add to queue with delay
            smsQueue.push(item);
            await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
        }
    }
    
    isProcessingQueue = false;
};

// Send bulk SMS
const sendBulkSMS = async (phoneNumbers, message) => {
    const results = [];
    for (const phone of phoneNumbers) {
        const result = await sendSMS(phone, message);
        results.push({ phone, ...result });
        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    return results;
};

// Send trip alert SMS
const sendTripAlert = async (phoneNumber, tripDetails) => {
    const message = `URGENT: Trip ${tripDetails.route} at ${tripDetails.time} on ${tripDetails.date} has been ${tripDetails.status}. - Transport Office`;
    return await sendSMS(phoneNumber, message);
};

// Send driver schedule SMS
const sendDriverScheduleSMS = async (phoneNumber, tripDetails) => {
    const message = `Trip Assignment: ${tripDetails.route} on ${tripDetails.date} at ${tripDetails.time}. Vehicle: ${tripDetails.vehicle}. - Transport Office`;
    return await sendSMS(phoneNumber, message);
};

// Send maintenance alert SMS
const sendMaintenanceAlert = async (phoneNumber, vehicleDetails) => {
    const message = `MAINTENANCE ALERT: Vehicle ${vehicleDetails.registration} needs service by ${vehicleDetails.dueDate}. - Fleet Office`;
    return await sendSMS(phoneNumber, message);
};

// Test SMS configuration
const testSMSConfig = async (testPhoneNumber) => {
    const testMessage = `Test SMS from Injibara Transport System at ${new Date().toISOString()}`;
    const result = await sendSMS(testPhoneNumber, testMessage);
    if (result.success) {
        console.log('✅ SMS configuration is valid');
    } else {
        console.error('❌ SMS configuration failed:', result.error);
    }
    return result;
};

module.exports = {
    sendSMS,
    sendBulkSMS,
    sendTripAlert,
    sendDriverScheduleSMS,
    sendMaintenanceAlert,
    formatPhoneNumber,
    testSMSConfig
};