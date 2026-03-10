# SafeHome Admin Dashboard

A modern, modular React admin dashboard for SafeHome system management built with TypeScript, React Router, and Tailwind CSS.

## 🎯 Features

- **Authentication System**: Secure login with context-based state management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Multi-page Navigation**: React Router v6 for seamless navigation
- **Modular Components**: Reusable, well-structured React components
- **Dashboard**: Real-time overview of system status and statistics
- **Sensor Management**: Monitor and manage all connected sensors
- **User Management**: Manage users and their roles/permissions
- **System Logs**: Comprehensive logging of all system activities
- **Maintenance Tracking**: Schedule and track maintenance tasks
- **Type Safety**: Full TypeScript support for better development experience

## 📁 Project Structure

```
src/
├── components/
│   ├── common/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Alert.tsx
│   ├── layout/              # Layout components
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   └── ProtectedRoute.tsx   # Authentication wrapper
├── pages/                   # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── SensorsPage.tsx
│   ├── UsersPage.tsx
│   ├── LogsPage.tsx
│   └── MaintenancePage.tsx
├── contexts/                # React Context for state management
│   └── AuthContext.tsx
├── hooks/                   # Custom React hooks
│   └── useAuth.ts
├── types/                   # TypeScript type definitions
│   └── index.ts
├── utils/                   # Utility functions
├── App.tsx                  # Main app component with routing
├── main.tsx                 # Entry point
└── globals.css              # Global styles and Tailwind imports
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. **Navigate to project directory**
```bash
cd AdminSafeHome
```

2. **Install dependencies**
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Demo Credentials

- **Email**: admin@safehome.com
- **Password**: password123

### Building for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📦 Dependencies

### Core
- **react** (18.2.0) - UI library
- **react-dom** (18.2.0) - React DOM rendering
- **react-router-dom** (6.20.0) - Client-side routing

### Styling
- **tailwindcss** (3.3.6) - Utility-first CSS framework
- **postcss** (8.4.32) - CSS processing
- **autoprefixer** (10.4.16) - CSS vendor prefixing

### Icons
- **lucide-react** (0.344.0) - Beautiful SVG icons

### Development
- **typescript** (5.2.2) - Type safety
- **vite** (5.0.8) - Build tool
- **@vitejs/plugin-react** (4.2.1) - React plugin for Vite

## 🎨 Component Overview

### Common Components

#### Button
Reusable button component with variants (primary, secondary, danger, success) and sizes (sm, md, lg).

```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

#### Input
Form input component with label, error handling, and optional icon support.

```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  icon={<Mail />}
  error={emailError}
/>
```

#### Card
Container component for organizing content with optional title and subtitle.

```tsx
<Card title="Card Title" subtitle="Optional subtitle">
  Content goes here
</Card>
```

#### Alert
Alert/notification component with different types (error, success, warning, info).

```tsx
<Alert type="error" title="Error" message="Something went wrong" />
```

### Layout Components

#### Sidebar
Navigation sidebar with responsive mobile menu toggle.

#### MainLayout
Main layout wrapper that applies sidebar and responsive padding to all pages.

## 🔐 Authentication

The app uses React Context API for state management. Authentication state includes:

- User information (id, email, name, role)
- Authentication status
- Login/logout functions

Protected routes use the `ProtectedRoute` component to redirect unauthenticated users to the login page.

## 🎯 Pages

### Login Page
- Email and password input fields
- Demo credentials available
- Error handling and validation

### Dashboard
- System statistics overview
- Active alerts display
- Recent activity feed
- Responsive stat cards

### Sensors
- List of all connected sensors
- Sensor type, location, and status
- Real-time values
- Edit and delete functionality

### Users
- User list with roles and status
- Role-based color coding
- Admin badge for admin users
- User management actions

### System Logs
- Chronological log entries
- Log type indicators (error, warning, info)
- Timestamp and relative time display
- Log statistics summary

### Maintenance
- Maintenance record list
- Task status tracking (pending, in-progress, completed)
- Type indicators (preventive, corrective)
- Scheduled and completion dates

## 🎨 Styling

The project uses Tailwind CSS with custom configuration:

- **Custom Color Palette**: SafeHome branded colors (shades of blue)
- **Responsive Design**: Mobile-first approach
- **Dark Sidebar**: SafeHome primary color
- **Clean UI**: Modern, minimalist design

## 📝 Type Definitions

TypeScript types are centralized in `src/types/index.ts`:

- `User` - User data structure
- `Sensor` - Sensor data structure
- `SystemLog` - System log entry
- `MaintenanceRecord` - Maintenance task
- `DashboardStats` - Dashboard statistics
- `AuthUser` - Authenticated user info
- `AuthContextType` - Auth context type

## 🔧 Extending the Project

### Adding a New Page

1. Create a new component in `src/pages/`
2. Import `MainLayout` for consistent styling
3. Add route to `App.tsx`
4. Add navigation item to `Sidebar.tsx`

### Adding a New Component

1. Create component in `src/components/common/` or appropriate subdirectory
2. Export from component file
3. Import and use in pages

### Adding New Types

Add type definitions to `src/types/index.ts`

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port.

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist`

### TypeScript Errors
Make sure all TypeScript files have proper type exports and imports.

## 📚 Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Vite Documentation](https://vitejs.dev)

## 📄 License

This project is part of the SafeHome system. All rights reserved.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📞 Support

For support and questions, please refer to the SafeHome documentation or contact the development team.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
