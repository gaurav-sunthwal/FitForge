# Quick Admin Panel Usage Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Create Admin Account
1. Open your browser and go to: `http://localhost:3000/admin/register`
2. Fill in the form:
   - **Name**: Your name
   - **Email**: Your admin email
   - **Password**: Choose a secure password
   - **Setup Secret Key**: `setup-admin-2026`
3. Click "Create Admin Account"

### Step 2: Login
1. Go to: `http://localhost:3000/admin/login`
2. Enter your email and password
3. Click "Sign In"

### Step 3: Send Notification
1. Click the "**+ Create New Notification**" button
2. Fill in:
   - **Title**: Your notification headline (required)
   - **Message**: Your notification body (required)
   - **Image URL**: Optional - adds visual appeal
   - **Action URL**: Optional - deep link to specific app screen
3. Click "**📤 Send to All Users**"

## 📱 Example Notifications

### Workout Challenge
```
Title: 💪 New 30-Day Challenge!
Message: Join our exclusive fitness challenge and win amazing prizes. Start today!
Image URL: https://example.com/challenge-banner.jpg
Action URL: fitforge://challenges/30day
```

### New Feature Announcement
```
Title: 🎉 New AI Meal Planner Available!
Message: Check out our new AI-powered meal planning feature. Get personalized nutrition advice!
Action URL: fitforge://calories
```

### Motivational Message
```
Title: You're Doing Great! 🌟
Message: Keep up the amazing work! You've logged 5 workouts this week. Your dedication is inspiring!
```

### Event Reminder
```
Title: 📅 Live Workout Session Tomorrow!
Message: Don't miss our live HIIT workout session tomorrow at 6 PM. See you there!
Action URL: fitforge://events/live-session
```

## 📊 Dashboard Features

- **View Notification History**: See all sent notifications with timestamps
- **Track Recipients**: Know how many users received each notification  
- **Monitor Status**: All sent notifications show delivery status
- **Quick Access**: Easily send new notifications anytime

## 🔐 Security Tips

1. **Keep your password secure** - Don't share it with others
2. **Use strong passwords** - Minimum 6 characters, mix of letters and numbers
3. **Log out when done** - Click the logout button in the top right
4. **Change setup secret** - Update `ADMIN_SETUP_SECRET` in production

## 🎨 Best Practices for Notifications

### ✅ DO's
- Keep titles short and catchy (under 50 characters)
- Make messages clear and actionable
- Use emojis to grab attention 😊
- Test notifications on your own device first
- Send notifications at appropriate times (not late at night)
- Include a call-to-action in the message

### ❌ DON'Ts
- Don't spam users with too many notifications
- Avoid all caps (IT LOOKS LIKE SHOUTING)
- Don't send sensitive information
- Avoid vague messages without context
- Don't use broken or invalid URLs

## 💡 Pro Tips

1. **Use Images**: Notifications with images get 3x more engagement
2. **Deep Links**: Action URLs can open specific screens in the app
3. **Timing Matters**: Send during peak app usage hours
4. **Personalization**: Even though it's to all users, make it feel personal
5. **Clear Value**: Always communicate what's in it for the user

## 🔗 Deep Link Examples

```
fitforge://home              -> Opens home screen
fitforge://calories          -> Opens calorie tracking
fitforge://workout           -> Opens workout log
fitforge://progress          -> Opens progress photos
fitforge://settings          -> Opens settings
```

## 📞 Need Help?

- Check the full setup guide: `ADMIN_NOTIFICATION_SETUP.md`
- Verify notifications in database: Run `npm run db:studio`
- Check mobile app logs for debugging
- Ensure users have notification permissions enabled

---

**Admin Panel URLs:**
- Login: `http://localhost:3000/admin/login`
- Register: `http://localhost:3000/admin/register`  
- Dashboard: `http://localhost:3000/admin/dashboard`

**Remember**: Notifications are powerful! Use them wisely to engage and delight your users. 🚀
