"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.sendContactNotification = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: options.from || process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
const sendContactNotification = async (contactData) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
      <p><strong>Service:</strong> ${contactData.service}</p>
      <p><strong>Company:</strong> ${contactData.company || 'Not provided'}</p>
      <p><strong>Website:</strong> ${contactData.website || 'Not provided'}</p>
      <p><strong>Budget:</strong> ${contactData.budget || 'Not specified'}</p>
      <p><strong>Timeline:</strong> ${contactData.timeline || 'Not specified'}</p>
      <p><strong>Message:</strong></p>
      <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${contactData.message}</p>
      <p><strong>Submitted:</strong> ${contactData.submittedAt ? contactData.submittedAt.toLocaleString() : new Date().toLocaleString()}</p>
    </div>
  `;
    await (0, exports.sendEmail)({
        to: process.env.EMAIL_FROM,
        subject: `New Contact Form Submission - ${contactData.firstName} ${contactData.lastName}`,
        html
    });
};
exports.sendContactNotification = sendContactNotification;
const sendWelcomeEmail = async (userData) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Adsiri Growth Hub!</h2>
      <p>Hi ${userData.name},</p>
      <p>Thank you for contacting us. We've received your inquiry and our team will get back to you within 24 hours.</p>
      <p>In the meantime, here's what you can expect:</p>
      <ul>
        <li>Initial consultation call</li>
        <li>Custom strategy proposal</li>
        <li>Detailed project timeline</li>
        <li>Transparent pricing</li>
      </ul>
      <p>If you have any urgent questions, feel free to reach out to us at ${process.env.EMAIL_FROM}.</p>
      <p>Best regards,<br>The Adsiri Team</p>
    </div>
  `;
    await (0, exports.sendEmail)({
        to: userData.email,
        subject: 'Thank you for contacting Adsiri Growth Hub',
        html
    });
};
exports.sendWelcomeEmail = sendWelcomeEmail;
//# sourceMappingURL=sendEmail.js.map