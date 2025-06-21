# 🗺️ Hidden Spots - Discover Secret Places in Gwalior

A premium React Native app built with Expo that helps users discover and share hidden gems in Gwalior, Madhya Pradesh. Experience the city like never before with our community-driven platform featuring stunning UI, smooth animations, and delightful interactions.

![Hidden Spots App](https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## ✨ Features

### 🎨 **Premium UI/UX**
- **Apple-level design aesthetics** with meticulous attention to detail
- **Glassmorphism effects** with native blur on iOS/Android and CSS fallbacks on web
- **Premium animations** with 60fps performance using Reanimated 3
- **Haptic feedback** on mobile devices for delightful interactions
- **Parallax scrolling** with dynamic header animations
- **Gesture-based interactions** with spring physics

### 🏞️ **Core Functionality**
- **Discover hidden spots** with interactive maps (mobile) and elegant list views
- **Add new spots** with photos, stories, ratings, and tips
- **Community experiences** and reviews from fellow explorers
- **Category filtering** (Romantic, Serene, Creative, Adventure)
- **Real-time search** and advanced filtering options
- **Location services** with GPS integration

### 📱 **Platform Optimization**
- **Cross-platform compatibility** (iOS, Android, Web)
- **Native features** on mobile with web fallbacks
- **Responsive design** that works beautifully on all screen sizes
- **Platform-specific UI elements** (iOS blur effects, Android material design)

### 🎭 **Advanced Animations**
- **Shimmer effects** on button interactions
- **Smooth transitions** with spring physics
- **Pulsing location indicators**
- **Gesture-driven animations** with proper feedback
- **Loading states** with skeleton loaders

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hidden-spots-app.git
   cd hidden-spots-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Run on your device**
   - Install Expo Go on your mobile device
   - Scan the QR code displayed in the terminal
   - Or press `i` for iOS simulator, `a` for Android emulator

## 📱 Platform-Specific Features

### iOS
- Native BlurView for glassmorphism effects
- Haptic feedback integration
- iOS-specific tab bar styling
- Native map integration

### Android
- Material Design elevation and shadows
- Android-specific haptic patterns
- Optimized performance for various Android devices
- Native map integration

### Web
- CSS backdrop-filter fallbacks for glassmorphism
- Responsive design for desktop and mobile browsers
- Touch-friendly interactions
- Elegant map placeholder with spot listings

## 🎨 Design System

### Typography
- **Playfair Display**: Elegant headings and titles
- **Inter**: Clean, modern body text (Light to ExtraBold)
- Carefully crafted hierarchy with proper spacing

### Colors
- **Primary**: Orange gradient (#EA580C → #DC2626 → #B91C1C)
- **Secondary**: Blue gradient (#1E3A8A → #3B82F6 → #60A5FA)
- **Categories**: 
  - Romantic: #EC4899
  - Serene: #059669
  - Creative: #7C3AED
  - Adventure: #EA580C

### Components
- **GlassCard**: Glassmorphism effects with platform-specific implementations
- **PremiumButton**: Advanced animated buttons with haptic feedback
- **ParallaxScrollView**: Smooth parallax scrolling
- **PulsingDot**: Animated location indicators

## 🏗️ Architecture

### File Structure
```
app/
├── (tabs)/                 # Tab-based navigation
│   ├── index.tsx          # Discover screen
│   ├── spots.tsx          # Spots listing
│   ├── add.tsx            # Add new spot
│   └── profile.tsx        # User profile
├── _layout.tsx            # Root layout
└── +not-found.tsx         # 404 page

components/
├── SpotCard.tsx           # Enhanced spot cards
├── GlassCard.tsx          # Glassmorphism component
├── PremiumButton.tsx      # Advanced button component
├── ParallaxScrollView.tsx # Parallax scrolling
├── PulsingDot.tsx         # Animated indicators
├── LoadingSpinner.tsx     # Loading animations
├── Toast.tsx              # Toast notifications
└── ...

hooks/
├── useToast.ts            # Toast management
└── useFrameworkReady.ts   # Framework initialization

data/
└── spots.ts               # Sample data and categories

types/
└── index.ts               # TypeScript definitions
```

### Key Technologies
- **Expo Router 4.0.17**: File-based routing
- **React Native Reanimated 3**: High-performance animations
- **React Native Gesture Handler**: Native gesture recognition
- **Expo Location**: GPS and location services
- **Expo Image Picker**: Camera and gallery integration
- **Expo Linear Gradient**: Beautiful gradients
- **Expo Blur**: Native blur effects

## 🎯 Performance Optimizations

- **60fps animations** with Reanimated worklets
- **Optimized image loading** with proper caching
- **Lazy loading** for better performance
- **Platform-specific optimizations**
- **Efficient state management**
- **Minimal re-renders** with proper memoization

## 📸 Screenshots

### Discover Screen
Beautiful map integration with category filtering and search functionality.

### Add Spot Screen
Intuitive form with parallax scrolling, photo upload, and rating system.

### Spot Details
Immersive modal with photo gallery, community reviews, and interactive elements.

### Profile Screen
Clean profile interface with achievements, statistics, and activity tracking.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build:web` - Build for web
- `npm run build:apk` - Build Android APK (requires EAS)
- `npm run build:aab` - Build Android App Bundle (requires EAS)
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=https://your-api-url.com
EXPO_PUBLIC_MAPS_API_KEY=your_maps_api_key
```

## 🚀 Deployment

### Web Deployment
```bash
npm run build:web
# Deploy the dist folder to your hosting provider
```

### Mobile App Stores
This app is ready for production deployment to both iOS App Store and Google Play Store using Expo Application Services (EAS).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pexels** for beautiful placeholder images
- **Lucide** for the comprehensive icon library
- **Expo team** for the amazing development platform
- **React Native community** for continuous innovation

## 📞 Support

For support, email support@hiddenspots.app or join our community Discord.

---

**Built with ❤️ using Expo and React Native**

*Discover the hidden beauty of Gwalior, one spot at a time.*
