import nodemailer from 'nodemailer';

/**
 * Create email transporter using Nodemailer
 * Configured for Gmail SMTP (can be changed for other providers)
 */
export const createEmailTransporter = () => {
  try {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️  Email not configured - email notifications disabled');
      return null;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    return transporter;
  } catch (error) {
    console.error('❌ Error creating email transporter:', error.message);
    return null;
  }
};

/**
 * Verify email transporter configuration
 */
export const verifyEmailConfig = async () => {
  try {
    const transporter = createEmailTransporter();
    await transporter.verify();
    console.log('✅ Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('⚠️  Email configuration verification failed:', error.message);
    console.warn('   Email notifications will not work. Please check your .env file.');
    return false;
  }
};
