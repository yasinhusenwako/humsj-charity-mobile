# HUMSJ Charity Mobile

A comprehensive mobile application for HUMSJ Charity Sector, built with React, TypeScript, and Capacitor. This app supports charitable donations, Islamic education initiatives, and community engagement for Muslim students at Haramaya University and beyond.

## 🚀 Features

### Core Functionality
- **Donation Management**: Multiple payment methods and subscription options
- **User Authentication**: Secure login system for donors and administrators
- **Dashboard**: Personalized dashboards for donors and admin panels
- **Islamic Content**: Educational resources and inspirational content
- **Gallery**: Visual showcase of charity activities and success stories
- **Contact & Support**: Integrated communication features

### Mobile-Specific Features
- **Push Notifications**: Real-time updates and donation reminders
- **Camera Integration**: Photo uploads for documentation
- **Offline Support**: Network status monitoring and offline capabilities
- **Native Performance**: Optimized for mobile devices with Capacitor

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **React Router** - Navigation and routing
- **React Query** - State management and data fetching
- **React Hook Form** - Form handling with validation

### Mobile Framework
- **Capacitor 8** - Native mobile app development
- **Android Support** - Native Android deployment
- **iOS Ready** - Configured for iOS deployment

### Backend & Services
- **Firebase** - Authentication, database, and cloud functions
- **Supabase** - Alternative backend services
- **Firebase Functions** - Serverless backend logic

## 📱 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Android Studio (for Android development)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd humsj-charity-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Add your Firebase and other API keys to .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for mobile**
   ```bash
   npm run build:mobile
   ```

### Android Development

1. **Setup Android environment**
   ```bash
   npm run setup-android
   ```

2. **Sync with Capacitor**
   ```bash
   npm run cap:sync
   ```

3. **Open Android Studio**
   ```bash
   npm run cap:open:android
   ```

4. **Run on device/emulator**
   ```bash
   npm run cap:run:android
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/          # React contexts (Auth, etc.)
├── hooks/             # Custom React hooks
├── pages/             # Page components
│   ├── donor/         # Donor-specific pages
│   └── admin/         # Admin-specific pages
├── services/          # API and mobile services
├── assets/            # Static assets (images, etc.)
└── utils/             # Utility functions
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:mobile` | Build and sync for mobile |
| `npm run cap:sync` | Sync Capacitor with native platforms |
| `npm run cap:open:android` | Open Android Studio |
| `npm run cap:run:android` | Run on Android device |
| `npm run lint` | Run ESLint |

## 🔐 Authentication & Security

- Firebase Authentication for user management
- Role-based access control (Donor, Admin)
- Secure API communication
- Environment variable protection

## 🌐 Deployment

### Web Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Mobile Deployment
```bash
npm run cap:build:android
# Build APK/AAB from Android Studio
```

## 📱 Platform Support

- ✅ Android (API 21+)
- 🔄 iOS (Configured, requires macOS setup)
- ✅ Web (PWA ready)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

## 🌟 Special Features

### Islamic Integration
- Prayer times and reminders
- Islamic educational content
- Zakat calculation tools
- Quranic inspiration sections

### Charity Management
- Real-time donation tracking
- Monthly subscription management
- Impact reports and analytics
- Donor recognition system

### Mobile Optimizations
- Offline mode support
- Push notification campaigns
- Camera integration for receipts
- Biometric authentication support

---

**HUMSJ Charity Sector** - Empowering communities through faith-based charity and education.
