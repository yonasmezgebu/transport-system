const { sendSMS, sendBulkSMS, sendTripAlert, sendDriverScheduleSMS, sendMaintenanceAlert, formatPhoneNumber } = require('../config/sms');

const SmsService = {
    // Send single SMS
    send: async (phoneNumber, message) => {
        try {
            return await sendSMS(phoneNumber, message);
        } catch (error) {
            console.error('SMS sending failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Send bulk SMS
    sendBulk: async (phoneNumbers, message) => {
        try {
            return await sendBulkSMS(phoneNumbers, message);
        } catch (error) {
            console.error('Bulk SMS failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Send trip alert SMS
    sendTripAlert: async (phoneNumber, tripDetails) => {
        try {
            return await sendTripAlert(phoneNumber, tripDetails);
        } catch (error) {
            console.error('Trip alert SMS failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Send bulk trip alerts
    sendBulkTripAlerts: async (recipients, tripDetails) => {
        const phoneNumbers = recipients.map(r => r.phone).filter(p => p);
        const message = `URGENT: Trip ${tripDetails.route} at ${tripDetails.time} on ${tripDetails.date} has been ${tripDetails.status}. - Transport Office`;
        return await SmsService.sendBulk(phoneNumbers, message);
    },

    // Send driver schedule SMS
    sendDriverSchedule: async (phoneNumber, tripDetails) => {
        try {
            return await sendDriverScheduleSMS(phoneNumber, tripDetails);
        } catch (error) {
            console.error('Driver schedule SMS failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Send maintenance alert SMS
    sendMaintenanceAlert: async (phoneNumber, vehicleDetails) => {
        try {
            return await sendMaintenanceAlert(phoneNumber, vehicleDetails);
        } catch (error) {
            console.error('Maintenance alert SMS failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Send request approval SMS
    sendRequestApproval: async (phoneNumber, requestDetails, status) => {
        try {
            const message = `Transport request ${status}: ${requestDetails.destination} on ${requestDetails.date} at ${requestDetails.time}. - Transport Office`;
            return await sendSMS(phoneNumber, message);
        } catch (error) {
            console.error('Request approval SMS failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Send incident report SMS
    sendIncidentAlert: async (phoneNumber, incidentDetails) => {
        try {
            const message = `INCIDENT REPORTED: ${incidentDetails.type} at ${incidentDetails.location} on ${incidentDetails.date}. Please check system for details.`;
            return await sendSMS(phoneNumber, message);
        } catch (error) {
            console.error('Incident alert SMS failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Send driver hour warning SMS
    sendHourWarning: async (phoneNumber, driverName, currentHours) => {
        try {
            const message = `WARNING: Driver ${driverName} has reached ${currentHours} of 48 weekly hours. Monitor driving hours. - Transport Office`;
            return await sendSMS(phoneNumber, message);
        } catch (error) {
            console.error('Hour warning SMS failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Format phone number for Ethiopia
    formatPhone: (phoneNumber) => {
        return formatPhoneNumber(phoneNumber);
    },

    // Validate phone number
    isValidPhone: (phoneNumber) => {
        const formatted = formatPhoneNumber(phoneNumber);
        return formatted !== null;
    },

    // Send test SMS
    sendTestSms: async (phoneNumber) => {
        const message = `Test SMS from Injibara University Transport System at ${new Date().toISOString()}`;
        return await sendSMS(phoneNumber, message);
    }
};

module.exports = SmsService;