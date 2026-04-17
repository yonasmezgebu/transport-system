const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000
    });
};

let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = createTransporter();
    }
    return transporter;
};

// Send email
const sendEmail = async (to, subject, html, from = null) => {
    try {
        const mailOptions = {
            from: from || `"Injibara Transport System" <${process.env.SMTP_USER}>`,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            html
        };

        const info = await getTransporter().sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Send welcome email to new user
const sendWelcomeEmail = async (email, name, role) => {
    const subject = 'Welcome to Injibara Transport System';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a56db;">Welcome to Injibara Transport System!</h2>
            <p>Dear ${name},</p>
            <p>Your account has been created as <strong>${role}</strong>. You can now log in to the system.</p>
            <p><strong>Login Credentials:</strong></p>
            <ul>
                <li>Email: ${email}</li>
                <li>Default Password: Driver@123 (please change after login)</li>
            </ul>
            <p>Login URL: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">${process.env.FRONTEND_URL || 'http://localhost:5173'}</a></p>
            <hr>
            <p style="font-size: 12px; color: #666;">Injibara University Transport Office</p>
        </div>
    `;
    return await sendEmail(email, subject, html);
};

// Send password reset email
const sendResetPasswordEmail = async (email, name, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a56db;">Password Reset Request</h2>
            <p>Dear ${name},</p>
            <p>You requested to reset your password. Click the link below to set a new password:</p>
            <p><a href="${resetUrl}" style="background: #1a56db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr>
            <p style="font-size: 12px; color: #666;">Injibara University Transport Office</p>
        </div>
    `;
    return await sendEmail(email, subject, html);
};

// Send trip notification
const sendTripNotification = async (email, name, tripDetails) => {
    const subject = `Trip Update: ${tripDetails.route}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a56db;">Trip Schedule Update</h2>
            <p>Dear ${name},</p>
            <p>A trip has been scheduled/updated:</p>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; background: #f3f4f6;"><strong>Date:</strong></td><td style="padding: 8px;">${tripDetails.date}</td></tr>
                <tr><td style="padding: 8px; background: #f3f4f6;"><strong>Time:</strong></td><td style="padding: 8px;">${tripDetails.time}</td></tr>
                <tr><td style="padding: 8px; background: #f3f4f6;"><strong>Route:</strong></td><td style="padding: 8px;">${tripDetails.route}</td></tr>
                <tr><td style="padding: 8px; background: #f3f4f6;"><strong>Driver:</strong></td><td style="padding: 8px;">${tripDetails.driver || 'TBA'}</td></tr>
                <tr><td style="padding: 8px; background: #f3f4f6;"><strong>Vehicle:</strong></td><td style="padding: 8px;">${tripDetails.vehicle || 'TBA'}</td></tr>
            </table>
            <hr>
            <p style="font-size: 12px; color: #666;">Injibara University Transport Office</p>
        </div>
    `;
    return await sendEmail(email, subject, html);
};

// Send request approval notification
const sendRequestApprovalNotification = async (email, name, requestDetails, status, reason = null) => {
    const subject = `Transport Request ${status.toUpperCase()}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: ${status === 'approved' ? '#0e9f6e' : '#e02424'};">Request ${status.toUpperCase()}</h2>
            <p>Dear ${name},</p>
            <p>Your transport request has been ${status}.</p>
            <p><strong>Request Details:</strong></p>
            <ul>
                <li>Date: ${requestDetails.date}</li>
                <li>Time: ${requestDetails.time}</li>
                <li>Destination: ${requestDetails.destination}</li>
                <li>Passengers: ${requestDetails.passengerCount}</li>
            </ul>
            ${reason ? `<p><strong>Reason for rejection:</strong> ${reason}</p>` : ''}
            <hr>
            <p style="font-size: 12px; color: #666;">Injibara University Transport Office</p>
        </div>
    `;
    return await sendEmail(email, subject, html);
};

// ========== NEW FUNCTION: Send Two-Factor Authentication Code ==========
const sendTwoFactorCode = async (email, name, code) => {
    const subject = 'Your Two-Factor Authentication Code';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a56db;">Two-Factor Authentication</h2>
            <p>Dear ${name},</p>
            <p>Your verification code is:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 5px; font-weight: bold; border-radius: 10px;">
                ${code}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr>
            <p style="font-size: 12px; color: #666;">Injibara University Transport Office</p>
        </div>
    `;
    return await sendEmail(email, subject, html);
};

// Test email configuration
const testEmailConfig = async () => {
    try {
        await getTransporter().verify();
        console.log('✅ Email configuration is valid');
        return true;
    } catch (error) {
        console.error('❌ Email configuration failed:', error.message);
        return false;
    }
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendResetPasswordEmail,
    sendTripNotification,
    sendRequestApprovalNotification,
    sendTwoFactorCode,  // Added this
    testEmailConfig
};