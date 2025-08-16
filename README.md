# ✨ Todo Master - Advanced React Todo Application

A modern, feature-rich todo application built with React, TypeScript, and Vite. Features drag-and-drop reordering, real-time countdown timers, category management, and a beautiful glass-morphism design.

![Todo Master](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.2.0-purple?style=for-the-badge&logo=vite)
![Tests](https://img.shields.io/badge/Tests-Vitest-green?style=for-the-badge&logo=vitest)

## 🚀 Features

### Core Functionality
- ✅ **Add/Edit/Delete Todos** - Complete CRUD operations
- ✅ **Mark Complete/Incomplete** - Toggle todo status with modern UI
- ✅ **Drag & Drop Reordering** - Intuitive reordering with @dnd-kit
- ✅ **Persistent Storage** - Local storage for data persistence

### Advanced Features
- ⏰ **Real-time Countdown Timers** - Shows days, hours, and minutes remaining
- 📅 **Due Date Management** - Set due dates with automatic timezone handling
- 🏷️ **Category System** - Combo box with predefined and custom categories
- 🔍 **Search & Filter** - Search by text or category
- 📊 **Progress Statistics** - Visual progress tracking with completion percentages

### User Experience
- 🎨 **Glass-morphism Design** - Modern, beautiful interface
- 📱 **Responsive Layout** - Works on desktop and mobile
- 🎭 **Smooth Animations** - Fade-in effects and transitions
- 🚫 **No Drag Handle During Search** - Smart UX considerations
- ⚡ **Fast Performance** - Optimized builds and code splitting

### Technical Features
- 🧪 **Comprehensive Testing** - Unit tests with Vitest and React Testing Library
- 🔧 **TypeScript** - Full type safety
- 📦 **Optimized Builds** - Production builds with chunk splitting
- 🚀 **Netlify Ready** - Pre-configured for deployment

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern React with hooks
- **TypeScript 5.2.2** - Type safety and developer experience
- **Vite 5.2.0** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### UI Components & Icons
- **Lucide React** - Beautiful, customizable icons
- **@dnd-kit** - Drag and drop functionality
- **Custom Components** - TodoInput, TodoItem, Timer, ComboBox

### Testing & Quality
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers
- **@testing-library/user-event** - User interaction testing

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16.0 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd react-todo-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

### Development
```bash
# Start development server with hot reload
npm run dev

# Start development server on specific port
npm run dev -- --port 3000
```

### Testing
```bash
# Run all tests
npm test

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test -- --watch
```

### Building
```bash
# Build for production
npm run build

# Build for production with optimizations
npm run build:prod

# Preview production build locally
npm run preview
```

### Code Quality
```bash
# Run TypeScript type checking
npx tsc --noEmit

# Check for linting issues
npm run lint
```

## 🧪 Testing

The application includes comprehensive unit tests for all major components:

### Test Coverage
- **TodoInput Component** - Form validation, submission, category management
- **TodoItem Component** - Display, interactions, drag & drop, timer visibility
- **Timer Component** - Countdown logic, overdue status, real-time updates
- **Utility Functions** - Time calculations, ID generation, date formatting

### Running Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode during development
npm test -- --watch

# Generate coverage report
npm run test:coverage
```

### Test Files Structure
```
src/
├── components/
│   └── __tests__/
│       ├── TodoInput.test.tsx
│       ├── TodoItem.test.tsx
│       └── Timer.test.tsx
├── utils/
│   └── __tests__/
│       └── index.test.ts
└── test/
    └── setup.ts
```

## 🚀 Deployment

### Netlify Deployment (Recommended)

The application is pre-configured for Netlify deployment with optimized settings.

#### Automatic Deployment
1. **Connect Repository**: Link your Git repository to Netlify
2. **Build Settings**: Netlify will automatically detect the configuration
   - Build command: `npm run build:prod`
   - Publish directory: `dist`
3. **Deploy**: Push to main branch to trigger deployment

#### Manual Deployment
```bash
# Build the application
npm run build:prod

# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### Configuration Files
- `netlify.toml` - Netlify configuration with build settings, redirects, and headers
- `_redirects` - SPA routing configuration

### Other Hosting Platforms

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Traditional Web Servers
```bash
# Build the application
npm run build:prod

# Upload the 'dist' folder to your web server
# Ensure your server is configured for SPA routing
```

## 🏗️ Project Structure

```
react-todo-app/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── __tests__/     # Component tests
│   │   ├── TodoInput.tsx  # Add todo form with combo box
│   │   ├── TodoItem.tsx   # Individual todo item with timer
│   │   ├── TodoList.tsx   # Todo list container
│   │   ├── Timer.tsx      # Real-time countdown timer
│   │   ├── ComboBox.tsx   # Custom dropdown component
│   │   └── index.ts       # Component exports
│   ├── constants/         # Application constants
│   │   └── categories.ts  # Category definitions
│   ├── hooks/             # Custom React hooks
│   │   ├── useTodos.ts    # Todo management logic
│   │   └── index.ts       # Hook exports
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # Todo interface
│   ├── utils/             # Utility functions
│   │   ├── __tests__/     # Utility tests
│   │   └── index.ts       # Helper functions
│   ├── test/              # Test configuration
│   │   └── setup.ts       # Test setup and mocks
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── dist/                  # Production build output
├── netlify.toml          # Netlify configuration
├── _redirects            # SPA routing for Netlify
├── vite.config.ts        # Vite configuration
├── vitest.config.ts      # Vitest test configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## ⚙️ Configuration

### Environment Variables
The application supports the following environment variables:

```bash
# Development
NODE_ENV=development

# Production
NODE_ENV=production
CI=true
```

### Vite Configuration
Key optimizations in `vite.config.ts`:
- **Chunk Splitting** - Separate vendor and UI library bundles
- **Source Maps** - For production debugging
- **Terser Minification** - Optimized JavaScript output
- **Modern Target** - ESNext for better performance

### Build Optimizations
Production builds include:
- ✅ Code splitting into vendor, UI, and app chunks
- ✅ Minification with Terser
- ✅ Source maps for debugging
- ✅ Optimized CSS with Tailwind purging
- ✅ Modern ES modules for better performance

## 🎨 Customization

### Styling
The application uses Tailwind CSS with custom glass-morphism effects:
- Modify `src/index.css` for global styles
- Update `tailwind.config.js` for theme customization
- Component styles use inline styles for dynamic behavior

### Categories
Add new predefined categories in `src/constants/categories.ts`:
```typescript
export const CATEGORY_OPTIONS = [
  { value: 'new-category', label: '🎯 New Category' },
  // ... existing categories
];
```

### Timer Behavior
Customize timer behavior in `src/components/Timer.tsx`:
- Update intervals (default: 60 seconds)
- Modify visual states (urgent, overdue)
- Change time formatting

## 🐛 Troubleshooting

### Common Issues

#### Development Server Issues
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

#### Build Issues
```bash
# Clear dist folder and rebuild
rm -rf dist
npm run build:prod
```

#### Test Issues
```bash
# Clear test cache
npx vitest --run --reporter=verbose
```

#### TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit
```

### Performance Issues
- Check bundle size: `npm run build:prod` and review chunk sizes
- Analyze with Vite Bundle Analyzer
- Ensure proper code splitting is working

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Add** tests for new functionality
5. **Run** tests (`npm test`)
6. **Build** the project (`npm run build:prod`)
7. **Commit** your changes (`git commit -m 'Add amazing feature'`)
8. **Push** to the branch (`git push origin feature/amazing-feature`)
9. **Open** a Pull Request

### Code Standards
- Use TypeScript for all new code
- Follow existing component patterns
- Add tests for new features
- Maintain responsive design
- Use semantic commit messages

### Testing Requirements
- Write unit tests for new components
- Ensure existing tests pass
- Aim for high test coverage
- Test user interactions and edge cases

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Vite Team** - For the blazing fast build tool
- **Lucide** - For beautiful icons
- **@dnd-kit** - For smooth drag and drop
- **Tailwind CSS** - For utility-first styling
- **Vitest Team** - For fast and modern testing

## 📞 Support

If you encounter any issues or have questions:
1. Check the [troubleshooting section](#-troubleshooting)
2. Review existing [GitHub issues](../../issues)
3. Create a new issue with detailed information
4. Include steps to reproduce and expected behavior

---

**Happy coding!** 🎉

Built with ❤️ using React, TypeScript, and modern web technologies.