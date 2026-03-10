# 🏠 Occupant Safe Home - React Dashboard

A modern, modular React application for smart home security and safety management. This project demonstrates best practices in React development with TypeScript, component reusability, and routing.

## 🚀 Features

- **Dashboard Overview** - Real-time system status and recent activity
- **Device Management** - Monitor and control connected smart home devices
- **Reporting System** - Generate and download security reports
- **Settings Management** - User preferences and account settings
- **Responsive Design** - Mobile-friendly interface
- **Modular Components** - Reusable, composable React components
- **Client-side Routing** - Seamless navigation with React Router

## 📦 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Header.tsx      # Header component
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── Footer.tsx      # Footer component
│   ├── StatusCard.tsx  # Status display card
│   ├── AlertBox.tsx    # Alert notification component
│   └── DeviceCard.tsx  # Smart device card component
├── pages/              # Page components
│   ├── Dashboard.tsx   # Dashboard page
│   ├── Devices.tsx     # Devices management page
│   ├── Reports.tsx     # Reports page
│   ├── Settings.tsx    # Settings page
│   └── NotFound.tsx    # 404 page
├── App.tsx             # Main app component with routing
├── main.tsx            # Entry point
└── index.css           # Global styling
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **Vite** - Fast build tool
- **ESLint** - Code linting

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🎯 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 📖 Component Documentation

### StatusCard
Displays a status indicator with title, value, icon, and status badge.

```tsx
<StatusCard
  title="Security Devices"
  value={8}
  icon="🔒"
  status="active"
/>
```

### AlertBox
Shows notification messages with different severity levels.

```tsx
<AlertBox
  type="info"
  title="System Status"
  message="All systems operational"
/>
```

### DeviceCard
Displays a smart device with status and control options.

```tsx
<DeviceCard
  name="Front Door Lock"
  type="Smart Lock"
  status="online"
  location="Front Entrance"
  battery={85}
  onToggle={() => handleToggle()}
/>
```

## 🗺️ Routing

The application uses React Router v6 for navigation:

- `/` - Redirects to dashboard
- `/dashboard` - Main dashboard view
- `/devices` - Device management
- `/reports` - Reports and analytics
- `/settings` - User settings
- `*` - 404 Not Found

## 🎨 Styling

The project uses CSS with a dark theme. Key styling features:

- CSS Grid for responsive layouts
- Flexbox for component alignment
- CSS variables for theming (customizable)
- Mobile-responsive design with media queries
- Smooth transitions and hover effects

## 🔧 Development Tips

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Update navigation links in `src/components/Sidebar.tsx`

### Creating Reusable Components

1. Create a new component in `src/components/`
2. Define TypeScript interfaces for props
3. Import and use in page components

### State Management

Currently using React's built-in `useState` hook. For larger applications, consider:
- Redux
- Zustand
- Context API

## 📝 Code Style

- TypeScript for type safety
- Functional components with hooks
- Props interfaces defined explicitly
- Clear, descriptive naming conventions

## 🚀 Future Enhancements

- [ ] API integration for real device data
- [ ] User authentication and authorization
- [ ] WebSocket support for real-time updates
- [ ] Chart library integration for analytics
- [ ] Dark/Light theme toggle
- [ ] Internationalization (i18n)
- [ ] Unit and integration tests
- [ ] Accessibility improvements (WCAG compliance)

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For questions or issues, please open an issue in the repository.

---

**Happy coding! 🚀**
