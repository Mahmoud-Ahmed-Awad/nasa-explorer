# NASA Explorer

A modern, interactive frontend application for exploring NASA missions, exoplanets, and satellites with stunning 3D visualizations, real-time data, and AI assistance.

## 🌟 Features

### Core Functionality
- **Space Missions**: Explore NASA missions with detailed information and 3D models
- **Exoplanets**: Discover planets beyond our solar system with interactive charts
- **Satellites**: Track satellites in real-time with interactive maps
- **AI Assistant**: Get answers about space and NASA data with our AI assistant

### Advanced Features
- **3D Visualizations**: Three.js powered 3D scenes with rocket models and orbiting planets
- **Starfield Background**: GPU-optimized particle system with parallax effects
- **Auto Theme Switching**: Automatic day/night theme switching based on time
- **Bilingual Support**: English and Arabic with RTL layout support
- **Real-time Timer**: Live time display with countdown to next theme switch
- **Interactive Charts**: Chart.js powered data visualizations
- **Satellite Maps**: React-Leaflet integration for real-time satellite tracking
- **PWA Support**: Progressive Web App capabilities with offline support

### User Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Smooth Animations**: Framer Motion and GSAP powered animations
- **Glass Morphism UI**: Modern glassmorphism design with neon accents
- **Accessibility**: Full keyboard navigation and ARIA support
- **Performance Optimized**: Lazy loading, code splitting, and optimized assets

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nasa-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
nasa-explorer/
├── public/
│   ├── api/                    # Sample JSON data
│   │   ├── missions.json
│   │   ├── exoplanets.json
│   │   └── satellites.json
│   └── assets/                 # Static assets
│       ├── missions/           # Mission images
│       ├── satellites/         # Satellite images
│       └── team/              # Team photos
├── src/
│   ├── components/            # Reusable components
│   │   ├── ThreeScene.jsx     # 3D scene component
│   │   ├── Starfield.jsx      # Starfield background
│   │   ├── Navbar.jsx         # Navigation bar
│   │   └── ...
│   ├── pages/                 # Page components
│   │   ├── Home.jsx           # Landing page
│   │   ├── Missions.jsx       # Missions page
│   │   ├── Exoplanets.jsx     # Exoplanets page
│   │   ├── Satellites.jsx     # Satellites page
│   │   ├── AI.jsx             # AI assistant page
│   │   └── Settings.jsx       # Settings page
│   ├── contexts/              # React contexts
│   │   ├── ThemeContext.jsx   # Theme management
│   │   └── I18nContext.jsx    # Internationalization
│   ├── services/              # API services
│   │   └── api.js             # API client
│   ├── hooks/                 # Custom hooks
│   └── utils/                 # Utility functions
├── scripts/                   # Build and utility scripts
│   └── generate-sample-data.js
└── tests/                     # Test files
```

## 🎨 Customization

### Adding 3D Models

1. Place your GLTF models in `public/assets/`
2. Update the model path in `ThreeScene.jsx`:
   ```jsx
   loader.load('/assets/your-model.glb', ...)
   ```

### NASA API Integration

1. Get your NASA API key from [api.nasa.gov](https://api.nasa.gov)
2. Add your API key to `.env`:
   ```env
   VITE_NASA_API_KEY=your_api_key_here
   ```
3. Update API endpoints in `src/services/api.js`

### Theme Customization

Modify `tailwind.config.js` to customize:
- Color palette
- Fonts
- Animations
- Spacing

### Adding New Languages

1. Add translations to `src/contexts/I18nContext.jsx`
2. Update the `resources` object with your language
3. Add language option to the language switcher

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📱 PWA Features

The app includes Progressive Web App capabilities:
- Offline support
- Installable on mobile devices
- Push notifications (ready for implementation)
- Background sync (ready for implementation)

## 🌐 Internationalization

Currently supports:
- **English** (en)
- **Arabic** (ar) with RTL support

To add more languages:
1. Add language resources to `I18nContext.jsx`
2. Update language detection settings
3. Test RTL support if applicable

## ⚡ Performance

The app is optimized for performance:
- **Code Splitting**: Pages are lazy-loaded
- **Asset Optimization**: Images and 3D models are optimized
- **Caching**: React Query for efficient data caching
- **Bundle Analysis**: Use `npm run build` to analyze bundle size

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run test         # Run tests
npm run generate-data # Generate sample data
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE=/api
VITE_NASA_API_KEY=your_nasa_api_key

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This is an educational project and is not affiliated with NASA. All NASA data and imagery are used under appropriate licensing terms. Please respect NASA's usage guidelines when using their APIs and data.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email Youssef012239@gmail.com or create an issue in the repository.

## 🎯 Roadmap

- [ ] Real-time satellite tracking integration
- [ ] WebXR support for VR/AR experiences
- [ ] Advanced AI features with real NASA data
- [ ] User accounts and personalized dashboards
- [ ] Social features and community sharing
- [ ] Mobile app versions (React Native)
- [ ] Advanced 3D model support
- [ ] Real-time collaboration features

---

**Built with Dama for space exploration enthusiasts**
