# 🔔 How Notification Timing Works

## ⚠️ Important: DAILY Notifications Explained

### How DAILY Trigger Works:

When you set a notification time (e.g., 7:00 PM), the system schedules it to repeat **DAILY** at that time.

**Key Behavior:**
- If the time **hasn't occurred yet today** → Notification fires **today** at that time
- If the time **already passed today** → Notification fires **tomorrow** at that time

### Example:

```
Current Time: 5:23 PM

Set notification for 7:00 PM:
✅ Will fire TODAY at 7:00 PM (in ~1.5 hours)

Set notification for 3:00 PM:
❌ Won't fire today (time already passed)
✅ Will fire TOMORROW at 3:00 PM
```

## 🧪 How to Test Notifications

### Method 1: Use "Test in 1 Minute" Button ⭐ (Recommended)

1. Open Notification Settings
2. Tap **"Test in 1 Minute"** button
3. You'll see an alert showing when it will fire
4. **Close the app** (swipe away from recent apps)
5. Wait 1 minute
6. Notification appears! ✅

This tests:
- ✅ Notification scheduling
- ✅ Background/closed app notifications
- ✅ Sound and vibration

### Method 2: Set a Time in the Near Future

1. Check current time (e.g., 5:25 PM)
2. Set gym selfie reminder for a few minutes ahead (e.g., 5:28 PM)
3. Save settings
4. Close the app completely
5. Wait for the time
6. Notification appears! ✅

### Method 3: Check Scheduled Notifications (Debug)

Add this code temporarily to see what's scheduled:

```typescript
const scheduled = await NotificationService.getAllScheduledNotifications();
console.log('Scheduled notifications:', scheduled.length);
scheduled.forEach(notif => {
    console.log('- ', notif.content.title, 'at', notif.trigger);
});
```

## 📱 Troubleshooting

### "I set a time but didn't get a notification"

**Most Common Reasons:**

1. **Time already passed today**
   - Solution: Set a time that's in the future today, or wait until tomorrow

2. **Testing on simulator/emulator**
   - Solution: Must use a physical device

3. **Permissions not granted**
   - Solution: Tap "Open Settings" button and enable notifications

4. **App not on physical device**
   - Notifications don't work in Expo Go on simulators
   - Solution: Build on physical device or use EAS Build

5. **Do Not Disturb mode enabled**
   - Solution: Disable DND or configure to allow notifications

### "Test button doesn't work"

Try this:
1. Close the app completely
2. Reopen it
3. Go to notifications
4. Tap "Test in 1 Minute"
5. Close app (swipe away)
6. Wait 60 seconds
7. Check notification tray

## ✅ Confirming Notifications are Working

### For Daily Reminders (Gym, Meals):

1. Set gym selfie for a time that hasn't occurred yet today
2. Set it for 2-3 minutes from now
3. Close the app
4. Wait
5. Notification appears ✅

Then it will repeat every day at that time!

### For Water Reminders:

Water reminders fire every X hours between 8 AM - 10 PM.

If you set "Every 2 hours":
- 8:00 AM
- 10:00 AM  
- 12:00 PM
- 2:00 PM
- 4:00 PM
- 6:00 PM
- 8:00 PM
- 10:00 PM

## 🎯 Best Testing Practice

**Quick Test (1 Minute):**
```
1. Tap "Test in 1 Minute"
2. See alert confirming time
3. Close app
4. Wait 60 seconds
5. Get notification ✅
```

**Real World Test (Near Future Time):**
```
Current Time: 5:25 PM

1. Set gym selfie: 5:28 PM
2. Close app
3. Wait 3 minutes
4. Get notification at 5:28 PM ✅
5. Tomorrow, you'll get it again at 5:28 PM ✅
```

## 📊 Expected Behavior

| Scenario | Result |
|----------|--------|
| Set future time today | Fires today ✅ |
| Set past time today | Fires tomorrow ✅ |
| App open | Fires (shows in-app) ✅ |
| App background | Fires (notification tray) ✅ |
| App closed | Fires (notification tray) ✅ |
| After device restart | Fires (Android with permission) ✅ |

## 💡 Pro Tips

1. **Always test with "Test in 1 Minute"** first to confirm everything works
2. **Close the app completely** when testing background notifications
3. **Check notification permissions** in device settings if having issues
4. **Set times at least 1-2 minutes in the future** for immediate testing
5. **Remember**: DAILY means it repeats every day, not just once

## 🎉 Summary

- ✅ **DAILY trigger** = Repeats every day at set time
- ✅ **Past time** = Fires tomorrow
- ✅ **Future  time** = Fires today
- ✅ **Test button** = Fires in 60 seconds
- ✅ **Works when app closed** = Yes!
