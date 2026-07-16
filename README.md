# 🕉️ Dharma Gita Wisdom

A modern, feature-rich web and mobile application for studying the **Bhagavad Gita** with interactive learning tools, translations, and personalized tracking.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building](#building)
- [Features in Detail](#features-in-detail)
- [Mobile & Desktop Support](#mobile--desktop-support)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**Dharma Gita Wisdom** is a comprehensive digital platform dedicated to the study and understanding of the Bhagavad Gita. This application provides an immersive learning experience with:

- Complete Bhagavad Gita text with 18 chapters and 700+ verses
- Multiple translations and word-by-word meanings
- Interactive learning modes including quizzes and flashcards
- Personalized study tracking and bookmarking
- Multi-language support
- Text-to-speech functionality
- Offline-first capabilities
- Responsive design for web and mobile devices

The application is built with modern web technologies and can be deployed as both a web application and as a native Android app using Capacitor.

## ✨ Features

### Core Learning Features
- **📖 Complete Text Access**: Full Bhagavad Gita with all 18 chapters and verses
- **🌐 Multi-Language Support**: Study in multiple languages including English and Hindi
- **📚 Translations & Meanings**: 
  - Full verse translations
  - Word-by-word meanings (Padanuvada)
  - Detailed verse commentary
  - Transliteration support

### Study Tools
- **📝 Interactive Quizzes**: Test your knowledge with chapter-based quizzes
- **🎴 Flashcards**: Memorize verses and concepts with spaced repetition
- **🔖 Bookmarks**: Save important verses for quick reference
- **✍️ Study Notes**: Create and manage personal notes on verses
- **📊 Progress Tracking**: Monitor your learning journey with detailed statistics

### User Experience
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, intuitive interface using Tailwind CSS and Radix UI
- **🔊 Text-to-Speech**: Listen to verses with devotional audio (Text-to-Speech)
- **📡 Offline Support**: Access previously loaded content without internet
- **⚡ Fast Performance**: Optimized with Vite for quick load times

### Mobile-Specific Features
- **📲 Native Mobile App**: Android app with full Capacitor integration
- **📌 Local Notifications**: Study reminders and daily quotes
- **🤝 Share Functionality**: Share verses and learnings with others
- **⛔ Network Awareness**: Handles offline/online transitions gracefully
- **💾 Local Storage**: Persists bookmarks and progress locally

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless component library
- **ShadCN UI** - Pre-built component library

### Mobile & Native
- **Capacitor** - Cross-platform app framework
- **Capacitor Plugins**:
  - Text-to-Speech
  - Local Notifications
  - Network Status
  - Preferences (Local Storage)
  - Share
  - Android Integration

### Build & Development
- **Bun** - Fast JavaScript runtime and package manager
- **ESLint** - Code quality and linting
- **PostCSS** - CSS processing

### Data
- **JSON/CSV Storage** - Bhagavad Gita dataset
- **Local Storage API** - Client-side persistence
- **Preferences Plugin** - Persistent key-value storage

## 📁 Project Structure

```
dharma-gita-wisdom/
├── src/
│   ├── components/              # React components
│   │   ├── ui/                 # ShadCN UI components
│   │   ├── Analytics.tsx       # Analytics tracking
│   │   ├── ChapterGrid.tsx     # Chapter display
│   │   ├── Header.tsx          # App header
│   │   ├── LearnMode.tsx       # Learning interface
│   │   ├── MobileNavigation.tsx # Mobile nav
│   │   └── ...
│   ├── pages/                   # Page components
│   │   ├── Index.tsx           # Home page
│   │   ├── ChapterDetail.tsx   # Chapter detail view
│   │   ├── Quiz.tsx            # Quiz page
│   │   ├── Flashcards.tsx      # Flashcard page
│   │   ├── Bookmarks.tsx       # Bookmarks page
│   │   └── Settings.tsx        # Settings page
│   ├── hooks/                   # Custom React hooks
│   │   ├── useLanguage.ts      # Language context
│   │   ├── useBookmarks.ts     # Bookmarks management
│   │   ├── useNotes.ts         # Notes management
│   │   ├── useTranslation.ts   # Translation logic
│   │   └── ...
│   ├── data/                    # Data files
│   │   ├── Bhagwad_Gita.json   # Main Gita data
│   │   ├── Bhagwad_Gita.csv    # CSV format data
│   │   └── chapterNames.ts     # Chapter metadata
│   ├── types/                   # TypeScript types
│   │   └── gita.ts             # Gita interfaces
│   ├── utils/                   # Utility functions
│   │   ├── capacitorUtils.ts   # Capacitor setup
│   │   ├── devotionalTts.ts    # Text-to-speech
│   │   └── imageUtils.ts       # Image processing
│   ├── lib/                     # Library utilities
│   ├── i18n/                    # Internationalization
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Entry point
├── public/                       # Static assets
├── android/                      # Android native code
│   ├── app/                     # Android app module
│   ├── gradle/                  # Gradle configuration
│   └── ...
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind config
├── capacitor.config.ts          # Capacitor config
├── package.json                 # Dependencies
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ or **Bun** (recommended)
- **npm** or **bun** package manager
- For Android development: **Android Studio** and **Android SDK**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dharma-gita-wisdom.git
   cd dharma-gita-wisdom
   ```

2. **Install dependencies**
   
   Using Bun (recommended):
   ```bash
   bun install
   ```
   
   Or using npm:
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create a `.env` file in the root directory (optional, for API keys or custom configs):
   ```env
   VITE_APP_NAME=Dharma Gita Wisdom
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   bun run dev
   ```
   
   The application will be available at `http://localhost:8080`

## 💻 Development

### Development Server

Start the development server with hot module reloading:

```bash
bun run dev
```

### Code Linting

Check code quality and style:

```bash
bun run lint
```

### File Organization

- Place new components in `src/components/`
- Add page components in `src/pages/`
- Create custom hooks in `src/hooks/`
- Keep utilities in `src/utils/`
- Define types in `src/types/`

### Adding Features

1. **New Pages**: Create a component in `src/pages/`, add route in `App.tsx`
2. **New Components**: Create in `src/components/`, use Radix UI + Tailwind
3. **Custom Hooks**: Create in `src/hooks/`, export from there
4. **Translations**: Add strings to `src/i18n/ui.ts`

## 🏗️ Building

### Web Build

Build the production-ready web application:

```bash
bun run build
```

The optimized output will be generated in the `dist/` directory.

### Development Build

Create a development build (with source maps):

```bash
bun run build:dev
```

### Preview Build

Preview the production build locally:

```bash
bun run preview
```

### Android Build

Prepare Android platform:

```bash
bun exec capacitor add android
```

Build and deploy Android app:

```bash
bun exec capacitor build android
```

Or open in Android Studio:

```bash
bun exec capacitor open android
```

## 📚 Features in Detail

### Study Modes

#### 📖 Reading Mode
- Browse chapters sequentially
- View verse-by-verse with translations
- Access detailed word meanings
- Navigate between verses smoothly

#### 🎴 Flashcard Mode
- Create flashcard sets from verses
- Practice with spaced repetition
- Track learning progress
- Customize card appearance

#### 📝 Quiz Mode
- Chapter-based quizzes
- Multiple choice questions
- Instant feedback
- Performance tracking

#### 📚 Learn Mode
- Structured learning path
- Chapter summaries
- Concept explanations
- Progressive difficulty

### User Data Management

#### Bookmarks
- Save favorite verses
- Quick access collection
- Persistent storage (local)
- Organized by chapter

#### Study Notes
- Create personal annotations
- Edit and delete notes
- Timestamped entries
- Linked to specific verses

#### Progress Tracking
- Chapters completed
- Verses read
- Study streaks
- Daily reading goals

### Multi-Language Support

The application supports multiple languages:
- **English** - Primary language
- **Hindi** - Sanskrit and Devanagari
- More languages can be added via `src/i18n/ui.ts`

### Accessibility

- Semantic HTML structure
- ARIA labels for assistive technology
- Keyboard navigation support
- High contrast modes

## 📱 Mobile & Desktop Support

### Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1024px
- **Desktop**: 1025px+

### Capacitor Integration

The app uses Capacitor for native mobile features:

```typescript
// Example: Text-to-Speech
import { TextToSpeech } from '@capacitor-community/text-to-speech';

await TextToSpeech.speak({
  text: verseText,
  lang: 'en-US',
  rate: 1.0,
});
```

### Native Plugins

- **Text-to-Speech**: Devotional audio pronunciation
- **Local Notifications**: Study reminders
- **Network Status**: Offline/online handling
- **Preferences**: Persistent storage
- **Share**: Social sharing of verses

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Coding Standards

- Use TypeScript for all new code
- Follow ESLint rules
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and reusable

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Rudra Rathod**
- GitHub: [@rudrarathod](https://github.com/rudrarathod)
- Project: Dharma Gita Wisdom

## 🙏 Acknowledgments

- Bhagavad Gita text and translations
- Open-source community
- Contributors and supporters

## 📞 Support & Contact

For questions, issues, or suggestions:

- **GitHub Issues**: [Report a bug](https://github.com/yourusername/dharma-gita-wisdom/issues)
- **Email**: your.email@example.com
- **Documentation**: [Wiki](#)

## 🔗 Related Resources

- [Bhagavad Gita](https://www.bhagavad-gita.org/)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [Capacitor Docs](https://capacitorjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for spiritual wisdom and modern technology**
