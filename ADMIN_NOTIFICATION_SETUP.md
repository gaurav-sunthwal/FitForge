# Admin Notification System - Setup Guide

## Overview
Your FitForge application now has a complete admin notification system that allows you to:
- Log in to an admin panel on your website
- Send push notifications to all app users with customizable content
- Track notification history
- View how many users received each notification

## 🚀 Quick Start

### 1. Create Your First Admin Account

Visit: `http://localhost:3000/admin/register`

Fill in:
- **Name**: Your name
- **Email**: Your admin email
- **Password**: Choose a secure password (min. 6 characters)
- **Setup Secret Key**: `setup-admin-2026` (default key)

After creating the account, you'll be redirected to the login page.

### 2. Log In to Admin Dashboard

Visit: `http://localhost:3000/admin/login`

Use the credentials you just created.

### 3. Send Your First Notification

Once logged in, you'll see the admin dashboard. Click "Create New Notification" and fill in:

**Required Fields:**
- **Title**: The notification headline (e.g., "New Workout Challenge!")
- **Body**: The notification message (e.g., "Join our 30-day challenge and win prizes!")

**Optional Fields:**
- **Image URL**: Add an image to make notifications more engaging
- **Action URL**: Deep link like `fitforge://workout/challenge` to open specific screens

Click "Send to All Users" to broadcast the notification!

## 📱 How It Works

### Backend (Database)
New tables have been created:
1. **admins** - Stores admin credentials (hashed passwords)
2. **notifications** - Stores all sent notifications with metadata
3. **user_notifications** - Tracks which users received each notification and read status
4. **device_tokens** - Stores user device tokens for push notifications

### API Endpoints Created

#### Admin Endpoints (Require Admin Auth)
- `POST /api/v1/admin/register` - Create admin account (requires secret key)
- `POST /api/v1/admin/login` - Admin login (returns JWT token)
- `POST /api/v1/admin/notifications` - Send notification to all users
- `GET /api/v1/admin/notifications` - Get notification history

#### User Endpoints (Require User Auth)
- `POST /api/v1/device-token` - Register device token for push notifications
- `DELETE /api/v1/device-token` - Remove device token (on logout)
- `GET /api/v1/user/notifications` - Get user's notifications
- `PUT /api/v1/user/notifications` - Mark notification as read

### Mobile App Integration
The mobile app automatically:
1. Requests notification permissions on startup
2. Gets the Expo push token
3. Registers the token with your backend
4. Receives push notifications sent from the admin panel

## 🎨 Admin Pages

### Login Page
- **URL**: `/admin/login`
- Beautiful gradient design
- Secure JWT authentication
- Link to registration page

### Registration Page
- **URL**: `/admin/register`
- Protected with setup secret key
- Creates hashed password accounts
- One-time setup for first admin

### Dashboard
- **URL**: `/admin/dashboard`
- Create new notifications with rich form
- View notification history
- See recipient counts
- Track sent notifications

## 🔒 Security Features

1. **Password Hashing**: Admin passwords are hashed with bcryptjs (10 rounds)
2. **JWT Authentication**: Separate JWT secret for admins (`ADMIN_JWT_SECRET`)
3. **Setup Secret**: Registration requires a secret key to prevent unauthorized admin creation
4. **Token Expiration**: Admin tokens expire after 24 hours

## ⚙️ Environment Variables

Add these to your `.env` file in `fitme-web`:

```env
# Existing variables
DATABASE_URL=your-database-url
JWT_SECRET=fitme-forge-secret-key-123456

# New admin variables
ADMIN_JWT_SECRET=admin-secret-key-987654
ADMIN_SETUP_SECRET=setup-admin-2026

# Optional: Expo push notification access token
EXPO_ACCESS_TOKEN=your-expo-access-token
```

## 📊 Notification Features

### Supported Fields
- **Title** (required): Up to 100 characters
- **Body** (required): Up to 500 characters
- **Image URL** (optional): URL to an image for rich notifications
- **Action URL** (optional): Deep link or URL to open when tapped

### Automatic Features
- Sends to all registered users
- Creates individual notification records per user
- Tracks delivery count
- Stores timestamp
- Records which admin sent it

### Future Enhancements (Easy to Add)
- Schedule notifications for later
- Target specific user groups
- Rich media notifications
- Notification analytics (open rates, click rates)
- Template system for common notifications

## 🧪 Testing the System

### Test Flow:
1. **Create admin account** at `/admin/register`
2. **Log in** at `/admin/login`
3. **Send a test notification** from the dashboard
4. **Open your mobile app** (must be on a physical device)
5. **Check if notification arrives**

### Debugging:
- Check browser console for API errors
- Check mobile app console for token registration logs
- Use Drizzle Studio (`npm run db:studio`) to view database records
- Verify device tokens are being saved in `device_tokens` table

## 📝 Database Migrations

Already completed! The following tables were created:
- ✅ admins
- ✅ notifications  
- ✅ user_notifications
- ✅ device_tokens

## 🎯 Next Steps

1. **Change the setup secret** in production (update `ADMIN_SETUP_SECRET`)
2. **Create your admin account**
3. **Test sending notifications**
4. **Customize notification templates** for your use cases
5. **Add more admins** if needed (they all use the registration page)

## 🆘 Troubleshooting

### Notifications not arriving?
- Ensure mobile app has notification permissions
- Check device tokens are being registered (check database)
- Verify push token is valid (check mobile logs)
- Test on physical device (not simulator)

### Can't create admin account?
- Verify the setup secret key matches `ADMIN_SETUP_SECRET` in `.env`
- Default key is: `setup-admin-2026`

### Login not working?
- Check email and password are correct
- Verify database has the admin record
- Check JWT_SECRET environment variable

## 📱 Mobile App Changes

The notification service now:
- Automatically registers device tokens on app start
- Unregisters tokens on logout
- Handles both local scheduled notifications AND push notifications from admin
- Stores tokens with platform info (iOS/Android)

## 🎉 You're All Set!

Your admin notification system is ready to use. Start by creating your admin account and sending your first notification to all users!

---

**Default Credentials for Testing:**
- Setup Secret: `setup-admin-2026`
- Admin JWT Secret: `admin-secret-key-987654`

**Remember to change these in production!**
