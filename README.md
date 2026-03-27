# Welp

An AI-powered restaurant discovery app that learns your food preferences and helps you find the perfect place to eat based on your tastes, location, and dining preferences.

## Description

Welp is a mobile-first restaurant recommendation app that takes the guesswork out of deciding where to eat. By tracking your food preferences, past orders, and reviews, the app uses AI to suggest restaurants that match your unique taste profile. Whether you're looking for something familiar or adventurous, cheap eats or fine dining, Welp adapts to your preferences and helps you discover your next favorite spot.

## Features

### Core Functionality
- **AI-Powered Recommendations**: Smart restaurant suggestions based on your preference history and reviews
- **Location-Based Search**: Find restaurants near your current location or search by address
- **Personalized Food Preferences**: Track your likes and dislikes across various food categories
- **Customizable Filters**:
  - Prefer unseen/familiar restaurants slider
  - Cheap/expensive preference slider
- **Google Places Integration**: Autocomplete address search powered by Google Places API

### User Experience
- **Order History**: Review past restaurant visits and update your reviews
- **Review System**: Rate restaurants and add comments to help the AI learn your preferences
- **Dark/Light Theme**: Automatic theme switching based on system preferences
- **Haptic Feedback**: Tactile responses for button presses and actions
- **Success Animations**: Visual feedback for saved preferences and completed actions

### Integrations
- **Uber Deep Linking**: One-tap transportation to your selected restaurant with destination pre-filled
- **Firebase Authentication**: Secure user accounts and data sync
- **Analytics Tracking**: Usage analytics to improve the app experience

### Mobile-Optimized
- Responsive design for both phones and tablets
- Gesture-based navigation
- Optimized keyboard handling
- Location permission management

## Tech Stack

### Frontend
- **React Native** (0.81.4) - Cross-platform mobile framework
- **Expo** (~54.0) - Development platform and build tools
- **TypeScript** (~5.9) - Type-safe development
- **Expo Router** - File-based routing system

### UI/UX
- **React Native Reanimated** - Smooth animations
- **Expo Haptics** - Tactile feedback
- **React Native Paper** - Material Design components
- **React Native Gesture Handler** - Touch gestures
- **Expo Symbols** - SF Symbols for iOS

### Backend & Services
- **Firebase**
  - Authentication (@react-native-firebase/auth)
  - Firestore Database (@react-native-firebase/firestore)
  - Analytics (@react-native-firebase/analytics)
- **Google Places API** - Address autocomplete and location search
- **Expo Location** - GPS and location services

### Storage & Data
- **AsyncStorage** - Local preference storage
- **Firestore** - Cloud data synchronization

### Additional Libraries
- **Expo Linking** - Deep linking (Uber integration)
- **Moment.js** - Date/time formatting
- **nanoid** - Unique ID generation
- **Expo Image** - Optimized image loading

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Expo CLI

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Firebase:
   - Add your `GoogleService-Info.plist` to the project root (iOS)
   - Configure Firebase project credentials

3. Configure Google Places API:
   - Obtain a Google Places API key
   - Add to your environment configuration

### Running the App

Start the development server:
```bash
npx expo start
```

Run on iOS Simulator:
```bash
npm run ios
```

Run on Android Emulator:
```bash
npm run android
```

### Building for Production

Build for iOS:
```bash
eas build --platform ios
```

Build for Android:
```bash
eas build --platform android
```

## Project Structure

```
welp/
├── app/                    # File-based routing (Expo Router)
│   ├── (dashboard)/       # Dashboard screens (profile, results, review)
│   └── (tabs)/            # Tab navigation screens
├── components/            # Reusable components
│   ├── home/             # Home screen components
│   ├── nav/              # Navigation components
│   ├── profile/          # Profile screen components
│   ├── results/          # Results screen components
│   └── ui/               # Shared UI components
├── constants/            # App constants and configuration
├── hooks/                # Custom React hooks
├── providers/            # Context providers (User, Prefs, Theme)
├── utils/                # Utility functions
└── assets/               # Images, fonts, and static assets
```

## Features in Detail

### Preference System
Users can customize their restaurant discovery experience through:
- Food category preferences (cuisines, dietary restrictions, etc.)
- Exploration slider: prefer new places vs. familiar favorites
- Price preference slider: budget-friendly vs. upscale dining

### Smart Search
- Current location detection with permission handling
- Address search with Google Places autocomplete
- Search history and quick examples

### Review & History
- Track all visited restaurants
- Edit reviews to refine AI recommendations
- View order history with timestamps
- Save preferences with visual confirmation

## License

Private

## Author

Built with ❤️ by bigjmn
