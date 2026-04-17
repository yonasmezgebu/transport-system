const { sendEmail, sendWelcomeEmail, sendResetPasswordEmail, sendTripNotification, sendRequestApprovalNotification } = require('../config/mail');

const EmailService = {
    // Send welcome email to new user
    sendWelcome: async (email, name, role) => {
        try {
            return await sendWelcomeEmail(email, name, role);
        } catch (error) {
            console.error('Welcome email failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Send password reset email
    sendPasswordReset: async (email, name, resetToken) => {
        try {
            return await sendResetPasswordEmail(email, name, resetToken);
        } catch (error) {
            console.error('Password reset email failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Send trip notification to staff/students
    sendTripUpdate: async (email, name, tripDetails) => {
        try {
            return await sendTripNotification(email, name, tripDetails);
        } catch (error) {
            console.error('Trip notification email failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Send bulk trip notifications
    sendBulkTripUpdate: async (recipients, tripDetails) => {
        const results = [];
        for (const recipient of recipients) {
            const result = await EmailService.sendTripUpdate(recipient.email, recipient.name, tripDetails);
            results.push({ email: recipient.email, ...result });
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return results;
    },

    // Send request approval notification
    sendRequestApproval: async (email, name, requestDetails, status, reason = null) => {
        try {
            return await sendRequestApprovalNotification(email, name, requestDetails, status, reason);
        } catch (error) {
            console.error('Request approval email failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Send driver schedule notification
    sendDriverSchedule: async (email, name, trips) => {
        try {
            const subject = 'Your Trip Schedule';
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a56db;">Your Trip Schedule</h2>
                    <p>Dear ${name},</p>
                    <p>Here are your upcoming trips:</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr><th style="padding: 8px; background: #f3f4f6;">Date</th><th style="padding: 8px; background: #f3f4f6;">Time</th><th style="padding: 8px; background: #f3f4f6;">Route</th><th style="padding: 8px; background: #f3f4f6;">Vehicle</th></tr>
                        </thead>
                        <tbody>
                            ${trips.map(trip => `
                                <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;">${trip.date}</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${trip.time}</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${trip.route}</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${trip.vehicle}</td></tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <hr>
                    <p style="font-size: 12px; color: #666;">Injibara University Transport Office</p>
                </div>
            `;
            return await sendEmail(email, subject, html);
        } catch (error) {
            console.error('Driver schedule email failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Send maintenance alert
    sendMaintenanceAlert: async (email, name, vehicleDetails) => {
        try {
            const subject = `Maintenance Alert: ${vehicleDetails.registration}`;
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #e02424;">Maintenance Alert</h2>
                    <p>Dear ${name},</p>
                    <p>The following vehicle requires maintenance:</p>
                    <ul>
                        <li><strong>Vehicle:</strong> ${vehicleDetails.registration} - ${vehicleDetails.model}</li>
                        <li><strong>Due Date:</strong> ${vehicleDetails.dueDate || 'Not specified'}</li>
                        <li><strong>Due Mileage:</strong> ${vehicleDetails.dueMileage?.toLocaleString() || 'Not specified'} km</li>
                        <li><strong>Current Mileage:</strong> ${vehicleDetails.currentMileage?.toLocaleString() || 'N/A'} km</li>
                    </ul>
                    <p>Please schedule maintenance as soon as possible.</p>
                    <hr>
                    <p style="font-size: 12px; color: #666;">Injibara University Transport Office</p>
                </div>
            `;
            return await sendEmail(email, subject, html);
        } catch (error) {
            console.error('Maintenance alert email failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Send document expiry alert
    sendDocumentExpiryAlert: async (email, name, documentDetails) => {
        try {
            const subject = `Document Expiry Alert: ${documentDetails.documentType}`;
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #e02424;">Document Expiry Alert</h2>
                    <p>Dear ${name},</p>
                    <p>The following document is expiring soon:</p>
                    <ul>
                        <li><strong>Vehicle:</strong> ${documentDetails.registration}</li>
                        <li><strong>Document Type:</strong> ${documentDetails.documentType}</li>
                        <li><strong>Expiry Date:</strong> ${documentDetails.expiryDate}</li>
                        <li><strong>Days Remaining:</strong> ${documentDetails.daysRemaining}</li>
                    </ul>
                    <p>Please renew the document before it expires.</p>
                    <hr>
                    <p style="font-size: 12px; color: #666;">Injibara University Transport Office</p>
                </div>
            `;
            return await sendEmail(email, subject, html);
        } catch (error) {
            console.error('Document expiry email failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Send test email
    sendTestEmail: async (email) => {
        const subject = 'Email Service Test';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a56db;">Email Service Test</h2>
                <p>This is a test email from Injibara University Transport System.</p>
                <p>If you received this, the email service is working correctly.</p>
                <p>Time: ${new Date().toISOString()}</p>
                <hr>
                <p style="font-size: 12px; color: #666;">Injibara University Transport Office</p>
            </div>
        `;
        return await sendEmail(email, subject, html);
    }
};

module.exports = EmailService;