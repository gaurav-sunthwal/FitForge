<div align="center">

# 🏋️ FitForge

### *Transform Your Fitness Journey with AI-Powered Tracking*

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-~54.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey?style=for-the-badge" alt="Platform">
</p>

---

### 📱 A Complete Fitness Ecosystem

**FitForge** is a modern, full-stack fitness tracking application that combines the power of AI with intuitive design to help you achieve your fitness goals. Track workouts, monitor nutrition, analyze progress, and stay motivated—all in one beautiful app.

</div>

---

## ✨ Key Features

### 🎯 **Smart Workout Tracking**
- 📸 **AI-Powered Image Validation** - Upload gym photos with automatic validation
- 🔥 **Streak System** - Build consistency with daily workout streaks
- 📅 **Interactive Calendar** - Visual workout history with marked dates
- 💪 **Progress Photos** - Track your transformation over time
- ⏱️ **Workout Logging** - Record duration, calories burned, and workout types

### 🍎 **Intelligent Nutrition Management**
- 🤖 **AI Meal Analysis** - Scan food photos for instant calorie & macro breakdown
- 📊 **Macro Tracking** - Monitor calories, protein, carbs, and fats
- 💧 **Hydration Tracker** - Visual water intake monitoring
- 🎯 **Goal Setting** - Personalized nutrition targets
- ✏️ **Manual Food Logging** - Quick and easy food entry

### 📈 **Performance Analytics**
- 📉 **Trend Visualization** - Beautiful charts for calorie, protein, and water intake
- 🏆 **Goal Achievement Rings** - Visual progress indicators
- 📊 **Workout Activity Charts** - Track calories burned per session
- 📅 **Time Range Filters** - View data by week, month, or 3 months
- 🎯 **Smart Insights** - AI-powered performance recommendations

### 🎨 **Premium User Experience**
- 🌓 **Dark/Light Mode** - Seamless theme switching
- 🔄 **Pull-to-Refresh** - Real-time data synchronization
- ⚡ **Smooth Animations** - Delightful micro-interactions
- 📱 **Responsive Design** - Optimized for all screen sizes
- 🎯 **Intuitive Navigation** - Tab-based architecture

---

## 🏗️ Architecture

FitForge is built with a modern, scalable architecture:

```
┌─────────────────────────────────────────────────────┐
│                  Mobile App (Expo)                   │
│              React Native + TypeScript               │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │   Home   │  │ Calories │  │ Analytics│          │
│  │  Screen  │  │  Screen  │  │  Screen  │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────┬───────────────────────────────┘
                      │ REST API
┌─────────────────────▼───────────────────────────────┐
│              Backend API (Next.js)                   │
│                                                       │
│  ┌──────────────┐  ┌──────────────┐                │
│  │  API Routes  │  │  Drizzle ORM │                │
│  │  (RESTful)   │  │              │                │
│  └──────────────┘  └──────────────┘                │
│                                                       │
│  ┌──────────────────────────────────┐               │
│  │      Google Gemini AI            │               │
│  │  (Image & Meal Analysis)         │               │
│  └──────────────────────────────────┘               │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│          PostgreSQL Database (Neon)                  │
│                                                       │
│  users | userProfiles | userGoals | foodLogs        │
│  waterLogs | workoutLogs | progressPhotos           │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### **Mobile App** (`/fitme`)
| Technology | Purpose |
|------------|---------|
| **React Native** | Cross-platform mobile framework |
| **Expo** | Development platform & tooling |
| **TypeScript** | Type-safe development |
| **Expo Router** | File-based navigation |
| **React Native Reanimated** | Smooth animations |
| **React Native Chart Kit** | Data visualization |
| **React Native Calendars** | Calendar component |
| **Expo Image Picker** | Camera & gallery access |
| **AsyncStorage** | Local data persistence |

### **Backend API** (`/fitme-web`)
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | Full-stack React framework |
| **TypeScript** | Type-safe backend |
| **Drizzle ORM** | Type-safe database queries |
| **Neon PostgreSQL** | Serverless PostgreSQL database |
| **Google Gemini AI** | Image & meal analysis |
| **Framer Motion** | Web animations |
| **Tailwind CSS 4** | Utility-first styling |
| **Lenis** | Smooth scrolling |

---

## 📊 Database Schema

```sql
┌─────────────────────────────────────────────────────┐
│ users                                                │
├─────────────────────────────────────────────────────┤
│ id, email, name, imageUrl, themeMode,               │
│ notificationsEnabled, geminiApiKey                  │
└─────────────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼──────┐ ┌───▼──────┐ ┌───▼──────────┐
│userProfiles  │ │userGoals │ │ foodLogs     │
├──────────────┤ ├──────────┤ ├──────────────┤
│weight, height│ │calorieT. │ │foodName,     │
│age, gender   │ │proteinT. │ │calories,     │
│activityLevel │ │waterT.   │ │protein, etc. │
└──────────────┘ └──────────┘ └──────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ waterLogs    │ │ workoutLogs  │ │progressPhotos│
├──────────────┤ ├──────────────┤ ├──────────────┤
│amount,       │ │workoutName,  │ │imageUrl,     │
│timestamp     │ │duration,     │ │caption,      │
│              │ │caloriesBurned│ │timestamp     │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Expo CLI** (installed globally)
- **PostgreSQL** database (Neon recommended)
- **Google Gemini API Key** (optional, for AI features)

### Installation

#### 1️⃣ **Clone the Repository**

```bash
git clone https://github.com/gauravsunthwal-glimz/FitForge.git
cd FitForge
```

#### 2️⃣ **Setup Backend API**

```bash
cd fitme-web

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your environment variables to .env:
# DATABASE_URL=your_neon_postgres_connection_string
# GEMINI_API_KEY=your_gemini_api_key (optional)

# Push database schema
npm run db:push

# Start development server
npm run dev
```

The backend API will be running at `http://localhost:3000`

#### 3️⃣ **Setup Mobile App**

```bash
cd ../fitme

# Install dependencies
npm install

# Update API base URL in utils/api.ts if needed
# Default: https://fitme-gaurav.vercel.app/

# Start Expo development server
npm start
```

#### 4️⃣ **Run the App**

- **iOS**: Press `i` in the terminal or scan QR code with Camera app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **Web**: Press `w` in the terminal

---

## 📱 API Endpoints

### **User Management**
```
GET    /api/v1/user/profile          # Get user profile
POST   /api/v1/user/profile          # Update profile
POST   /api/v1/user/settings         # Update settings
GET    /api/v1/user/goals            # Get fitness goals
POST   /api/v1/user/goals            # Update goals
```

### **Nutrition Tracking**
```
GET    /api/v1/nutrition/daily/[date]    # Get daily nutrition data
POST   /api/v1/nutrition/log              # Log food item
DELETE /api/v1/nutrition/log/[foodId]    # Delete food log
POST   /api/v1/nutrition/water            # Log water intake
```

### **Progress & Workouts**
```
GET    /api/v1/progress/stats             # Get workout stats
POST   /api/v1/progress/workout-complete  # Log workout
POST   /api/v1/progress/photo             # Upload progress photo
GET    /api/v1/progress/analytics         # Get analytics data
```

### **AI Features**
```
POST   /api/v1/ai/analyze-meal        # Analyze meal from photo
POST   /api/v1/ai/validate-gym-image  # Validate gym photo
```

---

## 🎯 Key Features in Detail

### 🔥 Streak System
- Tracks consecutive days of workout completion
- Visual flame icon with animated counter
- Motivates daily consistency
- Automatically calculates based on workout logs

### 📸 AI Image Validation
- Uses Google Gemini Vision AI
- Validates uploaded photos are gym/workout related
- Provides feedback and suggestions
- Optional bypass for manual override

### 🍔 AI Meal Analysis
- Scan food photos for instant nutrition data
- Automatically extracts calories, protein, carbs, and fats
- Powered by Google Gemini AI
- Fallback to manual entry if AI unavailable

### 📊 Performance Analytics
- **Calorie Trend Chart** - Line graph showing daily intake
- **Protein Trend Chart** - Track muscle-building nutrition
- **Water Intake Chart** - Bar chart for hydration
- **Workout Activity** - Calories burned visualization
- **Goal Achievement Rings** - Visual progress indicators

### 🌓 Theme System
- **Light Mode** - Clean, bright interface
- **Dark Mode** - Easy on the eyes
- **System Mode** - Follows device settings
- Persistent preference storage

---

## 🎨 Screenshots

<div align="center">

| Home Screen | Nutrition Tracking | Analytics |
|-------------|-------------------|-----------|
| Track workouts & streaks | Monitor calories & macros | Visualize progress |

</div>

---

## 🔐 Authentication

FitForge uses a custom authentication system with user ID-based session management:

- User ID stored in AsyncStorage
- Sent via `x-user-id` header with all API requests
- Secure session management
- Easy to integrate with OAuth providers

---

## 🌟 Future Enhancements

- [ ] Social features (share progress, challenges)
- [ ] Workout plan templates
- [ ] Exercise library with videos
- [ ] Body measurements tracking
- [ ] Sleep quality monitoring
- [ ] Integration with wearables (Apple Watch, Fitbit)
- [ ] Meal planning & recipes
- [ ] Personal trainer matching
- [ ] Export data as PDF/CSV
- [ ] Push notifications for reminders

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Gaurav Sunthwal**

- GitHub: [@gauravsunthwal-glimz](https://github.com/gauravsunthwal-glimz)
- Email: gauravsunthwal@glimznow.com

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful image and meal analysis
- **Neon** - For serverless PostgreSQL hosting
- **Expo** - For amazing mobile development tools
- **Next.js** - For the robust backend framework
- **Vercel** - For seamless deployment

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ and 💪 by Gaurav Sunthwal**

</div>
