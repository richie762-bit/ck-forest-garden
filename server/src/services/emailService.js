import { createEmailTransporter } from '../config/email.js';

/**
 * Send Booking Confirmation Email to Customer
 */
export const sendBookingConfirmationEmail = async (booking) => {
  try {
    const transporter = createEmailTransporter();

    // Skip if email is not configured
    if (!transporter) {
      console.log('⚠️  Email not configured - skipping confirmation email');
      return false;
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: bold; color: #059669; }
          .detail-value { color: #333; }
          .total { background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .total-amount { font-size: 32px; font-weight: bold; color: #059669; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .highlight { background: #fef3c7; padding: 10px; border-left: 4px solid #f59e0b; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 CK Forest Garden</h1>
            <p style="margin: 0; font-size: 18px;">Booking Confirmation</p>
          </div>
          <div class="content">
            <p>Dear ${booking.customerName},</p>
            <p>Thank you for booking with CK Forest Garden! Your booking has been received and is being processed.</p>

            <div class="booking-details">
              <h2 style="color: #059669; margin-top: 0;">Booking Details</h2>

              <div class="detail-row">
                <span class="detail-label">Booking Reference:</span>
                <span class="detail-value"><strong>${booking.bookingReference}</strong></span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Booking Type:</span>
                <span class="detail-value">${booking.bookingType}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Date From:</span>
                <span class="detail-value">${new Date(booking.dateFrom).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Date To:</span>
                <span class="detail-value">${new Date(booking.dateTo).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Number of Days:</span>
                <span class="detail-value">${booking.numberOfDays} day${booking.numberOfDays > 1 ? 's' : ''}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Adults:</span>
                <span class="detail-value">${booking.numberOfAdults}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Children (Under 12):</span>
                <span class="detail-value">${booking.numberOfChildren} - <em style="color: #10b981;">FREE</em></span>
              </div>

              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">Rate per Adult per Day:</span>
                <span class="detail-value">GYD ${booking.ratePerAdultPerDay.toLocaleString()}</span>
              </div>
            </div>

            <div class="total">
              <p style="margin: 0; color: #059669; font-weight: bold;">Total Amount</p>
              <p class="total-amount">GYD ${booking.totalAmount.toLocaleString()}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280;">
                (${booking.numberOfAdults} adults × GYD ${booking.ratePerAdultPerDay.toLocaleString()} × ${booking.numberOfDays} day${booking.numberOfDays > 1 ? 's' : ''})
              </p>
            </div>

            <div class="highlight">
              <strong>⚠️ Important:</strong> Please upload your payment receipt to confirm your booking.
              Your booking reference is <strong>${booking.bookingReference}</strong>.
              Keep this for your records.
            </div>

            <p>If you have any questions, please don't hesitate to contact us.</p>

            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>CK Forest Garden Team</strong>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} CK Forest Garden. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: booking.customerEmail,
      subject: `Booking Confirmation - ${booking.bookingReference}`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${booking.customerEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error.message);
    // Don't throw error - email failure shouldn't break booking creation
    return false;
  }
};

/**
 * Send Booking Notification Email to Admin
 */
export const sendAdminNotificationEmail = async (booking) => {
  try {
    const transporter = createEmailTransporter();

    // Skip if email is not configured
    if (!transporter) {
      console.log('⚠️  Email not configured - skipping admin notification');
      return false;
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .label { font-weight: bold; color: #059669; }
          .alert { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔔 New Booking Received</h2>
          </div>
          <div class="content">
            <div class="alert">
              <strong>Action Required:</strong> A new booking has been created and requires your attention.
            </div>

            <div class="booking-details">
              <h3 style="margin-top: 0;">Booking Information</h3>
              <div class="detail-row">
                <span class="label">Reference:</span> ${booking.bookingReference}
              </div>
              <div class="detail-row">
                <span class="label">Customer:</span> ${booking.customerName}
              </div>
              <div class="detail-row">
                <span class="label">Email:</span> ${booking.customerEmail}
              </div>
              <div class="detail-row">
                <span class="label">Phone:</span> ${booking.customerPhone}
              </div>
              <div class="detail-row">
                <span class="label">Type:</span> ${booking.bookingType}
              </div>
              <div class="detail-row">
                <span class="label">Dates:</span> ${new Date(booking.dateFrom).toLocaleDateString()} - ${new Date(booking.dateTo).toLocaleDateString()}
              </div>
              <div class="detail-row">
                <span class="label">Adults:</span> ${booking.numberOfAdults}
              </div>
              <div class="detail-row">
                <span class="label">Children:</span> ${booking.numberOfChildren}
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span class="label">Total Amount:</span> <strong>GYD ${booking.totalAmount.toLocaleString()}</strong>
              </div>
            </div>

            <p style="text-align: center; margin-top: 20px;">
              <a href="${process.env.CLIENT_URL}/admin/bookings"
                 style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View in Admin Dashboard
              </a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Booking - ${booking.bookingReference}`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Admin notification sent for booking ${booking.bookingReference}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending admin notification:', error.message);
    return false;
  }
};

/**
 * Send Payment Receipt Upload Notification
 */
export const sendPaymentReceiptNotification = async (booking) => {
  try {
    const transporter = createEmailTransporter();

    // Skip if email is not configured
    if (!transporter) {
      console.log('⚠️  Email not configured - skipping payment receipt notification');
      return false;
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .success { background: #ecfdf5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Receipt Received</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.customerName},</p>
            <div class="success">
              <h2 style="color: #059669; margin-top: 0;">Thank You!</h2>
              <p>We have received your payment receipt for booking <strong>${booking.bookingReference}</strong>.</p>
              <p>Our team will review and confirm your booking shortly.</p>
            </div>
            <p>You will receive another email once your booking is confirmed.</p>
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>CK Forest Garden Team</strong>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} CK Forest Garden. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: booking.customerEmail,
      subject: `Payment Receipt Received - ${booking.bookingReference}`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Payment receipt notification sent to ${booking.customerEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending payment receipt notification:', error.message);
    return false;
  }
};
