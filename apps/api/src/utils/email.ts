import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

let transporter: nodemailer.Transporter | null = null;

if (ENV.SMTP_HOST && ENV.SMTP_USER && ENV.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
  });
}

export const sendVerificationEmail = async (toEmail: string, token: string): Promise<boolean> => {
  const verificationUrl = `${ENV.FRONTEND_URL}/verify-email?token=${token}`;

  if (!transporter) {
    console.log('\n======================================================');
    console.log('✉️  [LOCAL DEV EMAIL SERVICE] Email Verification Token');
    console.log(`Target Recipient: ${toEmail}`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log('Note: SMTP credentials not configured in .env. Safely logged to console.');
    console.log('======================================================\n');
    return true;
  }

  try {
    await transporter.sendMail({
      from: ENV.EMAIL_FROM,
      to: toEmail,
      subject: 'Verify Your SmartCampus Account',
      html: `
        <h2>Welcome to SmartCampus!</h2>
        <p>Please click the button below to verify your email address and activate your account:</p>
        <a href="${verificationUrl}" style="display:inline-block;padding:12px 24px;background-color:#2563eb;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
          Verify Email Address
        </a>
        <p style="margin-top:16px;color:#666;">If the button above does not work, copy and paste this URL into your browser:</p>
        <p>${verificationUrl}</p>
      `,
    });
    return true;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (toEmail: string, token: string): Promise<boolean> => {
  const resetUrl = `${ENV.FRONTEND_URL}/reset-password?token=${token}`;

  if (!transporter) {
    console.log('\n======================================================');
    console.log('🔑 [LOCAL DEV EMAIL SERVICE] Password Reset Token');
    console.log(`Target Recipient: ${toEmail}`);
    console.log(`Password Reset URL: ${resetUrl}`);
    console.log('Note: SMTP credentials not configured in .env. Safely logged to console.');
    console.log('======================================================\n');
    return true;
  }

  try {
    await transporter.sendMail({
      from: ENV.EMAIL_FROM,
      to: toEmail,
      subject: 'Reset Your SmartCampus Password',
      html: `
        <h2>SmartCampus Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background-color:#dc2626;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
          Reset Password
        </a>
        <p style="margin-top:16px;color:#666;">This token will expire in 1 hour.</p>
        <p>${resetUrl}</p>
      `,
    });
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return false;
  }
};
