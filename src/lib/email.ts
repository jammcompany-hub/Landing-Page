import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password (not your regular password)
  },
});

// Check if email is properly configured
export function isEmailConfigured(): boolean {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD);
}

export interface EmailOptions {
  subject: string;
  html: string;
  text?: string;
}

// Send email to a single recipient
export async function sendEmail(to: string, options: EmailOptions): Promise<{ success: boolean; message: string }> {
  try {
    const mailOptions = {
      from: `"Jamm App" <${process.env.EMAIL_USER}>`,
      to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email' };
  }
}

// Send email to all active subscribers
export async function sendEmailToAllSubscribers(options: EmailOptions): Promise<{ success: boolean; message: string; sentCount: number }> {
  try {
    const { getActiveSubscribers } = await import('./database');
    const subscribers = await getActiveSubscribers();
    
    if (subscribers.length === 0) {
      return { success: false, message: 'No active subscribers found', sentCount: 0 };
    }

    let successCount = 0;
    const errors: string[] = [];

    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 10;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const promises = batch.map(async (subscriber) => {
        const result = await sendEmail(subscriber.email, options);
        if (result.success) {
          successCount++;
        } else {
          errors.push(`${subscriber.email}: ${result.message}`);
        }
      });

      await Promise.all(promises);
      
      // Small delay between batches
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (errors.length > 0) {
      console.error('Some emails failed to send:', errors);
    }

    return {
      success: successCount > 0,
      message: `Sent ${successCount} out of ${subscribers.length} emails${errors.length > 0 ? ` (${errors.length} failed)` : ''}`,
      sentCount: successCount
    };
  } catch (error) {
    console.error('Error sending emails to subscribers:', error);
    return { success: false, message: 'Failed to send emails to subscribers', sentCount: 0 };
  }
}

// Create a welcome email template
export function createWelcomeEmail(): EmailOptions {
  return {
    subject: 'Welcome to Jamm - You\'re on the waitlist! 🕌',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #0B0B45 0%, #1E3ECF 100%); color: white; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #FFE066; font-size: 28px; margin: 0;">Welcome to Jamm!</h1>
          <p style="color: #ccc; font-size: 16px; margin: 10px 0;">You're officially on our waitlist</p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #FFE066; font-size: 20px; margin-top: 0;">What's Next?</h2>
          <p style="line-height: 1.6;">We're working hard to bring you the easiest way to coordinate group prayers and build community. As a waitlist member, you'll be among the first to know when we launch!</p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #FFE066; font-size: 18px; margin-top: 0;">What to Expect:</h3>
          <ul style="line-height: 1.8;">
            <li> AI-driven prayer time recommendations</li>
            <li> Easy schedule coordination with other students</li>
            <li> Building stronger faith and community</li>
            <li> Simple, user-friendly interface</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #ccc; font-size: 14px;">Thank you for joining our community. We can't wait to share Jamm with you!</p>
          <p style="color: #FFE066; font-size: 14px; font-weight: bold;">- The Jamm Team</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.2);">
          <p style="color: #999; font-size: 12px;">
            If you no longer wish to receive updates, you can 
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/unsubscribe?email=YOUR_EMAIL" style="color: #FFE066;">unsubscribe here</a>.
          </p>
        </div>
      </div>
    `
  };
}
