# Jamm Waitlist Setup Guide

This guide will help you set up the complete email collection and notification system for your Jamm landing page.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password

# Admin Authentication
ADMIN_TOKEN=your-secure-admin-token

# Base URL for unsubscribe links
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Admin token for frontend (optional, for admin page)
NEXT_PUBLIC_ADMIN_TOKEN=your-secure-admin-token
```

### 3. Gmail Setup

To send emails, you'll need to set up Gmail App Passwords:

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to "App passwords" section
4. Generate a new app password for "Mail"
5. Use this password as `EMAIL_APP_PASSWORD`

### 4. Create Data Directory

The system will automatically create a `data` directory to store waitlist entries.

## 📧 How It Works

### Email Collection
- Users enter their email on the landing page
- Email is validated and stored in `data/waitlist.json`
- Welcome email is automatically sent
- Duplicate emails are handled gracefully

### Sending Notifications
- Visit `/admin` to access the admin dashboard
- Enter email subject and HTML content
- Click "Send to All Subscribers"
- System sends emails in batches to avoid rate limits

### Unsubscribe
- Users can unsubscribe via `/unsubscribe` page
- Unsubscribe links are included in all emails
- Unsubscribed users are marked as inactive

## 🛠️ API Endpoints

### `POST /api/waitlist`
Add email to waitlist
```json
{
  "email": "user@example.com"
}
```

### `GET /api/waitlist`
Get waitlist statistics (admin only)

### `POST /api/admin/send-email`
Send email to all subscribers (admin only)
```json
{
  "subject": "Your Subject",
  "html": "<div>Your HTML content</div>"
}
```

### `POST /api/unsubscribe`
Unsubscribe from waitlist
```json
{
  "email": "user@example.com"
}
```

## 🎨 Customization

### Email Templates
- Modify `createWelcomeEmail()` in `src/lib/email.ts`
- Use the sample template in the admin dashboard
- All emails use your brand colors (#FFE066, #0B0B45, #1E3ECF)

### Styling
- The form integrates seamlessly with your existing design
- Success/error messages match your color scheme
- Admin dashboard uses the same visual style

## 🔒 Security

- **Environment Variables**: `.env.local` is completely secure and invisible to users
- **Admin Access**: Admin dashboard requires password authentication
- **API Protection**: Admin endpoints require authentication token
- **User Privacy**: Users cannot see other subscribers' emails
- **Email Validation**: Prevents spam and invalid submissions
- **Unsubscribe Links**: Secure and user-controlled
- **Data Protection**: All sensitive data is server-side only

## 📊 Database

The system uses a simple JSON file (`data/waitlist.json`) for storage. Each entry contains:

```json
{
  "id": "unique-id",
  "email": "user@example.com",
  "subscribedAt": "2024-01-01T00:00:00.000Z",
  "isActive": true
}
```

## 🚀 Deployment

1. Set environment variables in your hosting platform
2. Ensure the `data` directory is writable
3. Update `NEXT_PUBLIC_BASE_URL` to your production domain
4. Test the email functionality

## 🔧 Troubleshooting

### Emails not sending
- Check Gmail app password is correct
- Verify 2FA is enabled on Gmail account
- Check console logs for error messages

### Admin access issues
- Verify `ADMIN_TOKEN` is set correctly
- Check browser network tab for 401 errors

### Form not working
- Check browser console for JavaScript errors
- Verify API endpoints are accessible
- Test with a simple email address

## 📈 Scaling

For production use, consider:
- Migrating to a proper database (PostgreSQL, MongoDB)
- Using a dedicated email service (SendGrid, Mailgun)
- Adding rate limiting middleware
- Implementing proper user authentication
- Adding analytics and tracking

## 🎯 Next Steps

1. Test the complete flow locally
2. Set up your Gmail credentials
3. Deploy to your hosting platform
4. Send your first update to subscribers!

---

Need help? Check the console logs or create an issue in your repository.
