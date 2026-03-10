# SafeHome - Smart Home Security Dashboard

A complete React + TypeScript frontend application for intelligent fire detection and smart home monitoring.

## Features

### 🔐 Authentication
- User registration and login
- Password reset functionality
- JWT token management
- Secure session handling

### 📊 Dashboard
- Real-time system statistics
- Active alert monitoring
- Sensor status overview
- Response time metrics
- Recent alert feed
- Zone status cards

### 👁️ Supervision
- Real-time zone monitoring
- Live sensor data display
- Temperature, gas, and smoke readings
- Interactive zone detail modals
- Sensor status indicators

### ⚙️ System Control
- Global on/off toggle
- Zone-by-zone control
- Alarm management
- Temporary disable with duration/reason
- Visual system status

### 📱 Device Management
- Device list with status
- Online/offline detection
- Battery level monitoring
- Device configuration
- Toggle device activation

### 🚨 Alert Management
- Alert filtering (all/active/resolved)
- Severity levels (critique/attention/normale)
- Alert resolution tracking
- Alert statistics
- Alert detail view

### 📈 Reports
- Alert statistics
- System analytics
- Historical data
- Trend analysis

### 👨‍👩‍👧 Family Management
- Family member invitations
- Access control
- Role-based permissions
- Member removal
- Status tracking (active/pending)

### 📞 Emergency Contacts
- Contact management
- Emergency number storage
- Contact testing (sandbox mode)
- One-click emergency calling
- Custom contact relations

### 👤 User Profile
- Profile information editing
- Password management
- Notification preferences
- Data export
- Account security settings

### ⚙️ Settings
- Threshold configuration
- Temperature/gas/smoke levels
- Response time settings
- System preferences

## Tech Stack

- **React 18.2** - UI framework
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **Vite 5** - Fast build tool
- **CSS** - Responsive styling

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API integration layer
├── types/              # TypeScript type definitions
├── App.tsx             # Main router
├── main.tsx            # React entry point
└── index.css           # Global styles
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Available Routes

### Public Routes
- `/login` - User login
- `/register` - User registration
- `/reset-password` - Password recovery

### Protected Routes (Dashboard Layout)
- `/` - Dashboard
- `/dashboard` - Main dashboard
- `/supervision` - Real-time supervision
- `/devices` - Device management
- `/reports` - Analytics & reports
- `/alerts` - Alert management
- `/control` - System control
- `/contacts` - Emergency contacts
- `/family` - Family management
- `/profile` - User profile
- `/settings` - Configuration

### Special Routes
- `/404` - Not found page
- `*` - Catch-all (redirects to 404)

## API Services

The application includes pre-built services for all backend integration:

### Auth Service
```typescript
import { authService } from '@/services'

await authService.login({ email, password })
await authService.register(data)
await authService.resetPassword(email)
await authService.logout()
```

### System Service
```typescript
import { systemService } from '@/services'

const stats = await systemService.getDashboardStats()
const zones = await systemService.getZones()
const alerts = await systemService.getAlerts('active')
```

### Community Service
```typescript
import { communityService } from '@/services'

const contacts = await communityService.getContacts()
const members = await communityService.getFamilyMembers()
```

### User Service
```typescript
import { userService } from '@/services'

const profile = await userService.getProfile()
await userService.updateProfile(data)
```

## Component Library

### Layout Components
- `Layout` - Main app wrapper
- `Sidebar` - Navigation menu
- `Topbar` - Header with notifications

### Feature Components
- `StatusCard` - Statistics display
- `AlertBox` - Alert notifications
- `DeviceCard` - Device information

## Styling

The app uses a dark theme with custom CSS variables:

```css
--bg: #0a0e1a        /* Background */
--accent: #00c896    /* Primary accent (green) */
--accent2: #0088ff   /* Secondary accent (blue) */
--danger: #ef4444    /* Danger color (red) */
--warn: #f59e0b      /* Warning color (orange) */
```

### CSS Classes

- `.card` - Content card
- `.btn` - Button variants (primary, secondary, danger)
- `.badge` - Status badge
- `.toggle` - Toggle switch
- `.modal` - Modal dialog
- `.tab-group` - Tab navigation
- `.form-group` - Form field group

## Development Workflow

1. **Make changes** to files in `src/`
2. **Dev server** hot-reloads automatically (by Vite)
3. **Check types** with `npm run lint`
4. **Build** with `npm run build`

## Building for Production

```bash
npm run build
```

The `dist/` directory will contain optimized production files ready for deployment.

## Deployment

The built application can be deployed to:
- **Vercel** - `vercel deploy`
- **Netlify** - Drag & drop `dist/`
- **AWS S3 + CloudFront** - Auto-deploy via CI/CD
- **Any static host** - Just serve `dist/` directory

## Performance Features

- ✅ Code splitting by route
- ✅ Lazy loading of components
- ✅ Optimized CSS bundle (15.66 KB gzipped)
- ✅ Optimized JS bundle (226 KB total)
- ✅ Image optimization ready
- ✅ Responsive design

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- Semantic HTML
- ARIA labels ready
- Keyboard navigation support
- High contrast dark theme
- Focus indicators

## State Management

Currently uses React hooks (`useState`). For complex state, consider:
- Redux
- Zustand
- Context API
- Recoil

## License

Proprietary - SafeHome System

## Support

For integration questions, see `BACKEND_INTEGRATION.md`
For backend implementation, see `BACKEND_CHECKLIST.md`

## Final Checklist Before Production

- [ ] Environment variables configured
- [ ] API endpoints all working
- [ ] Authentication flow tested
- [ ] All pages loading correctly
- [ ] Responsive design verified (mobile/tablet/desktop)
- [ ] Navigation working properly
- [ ] Logout functionality tested
- [ ] Error handling in place
- [ ] Performance tested
- [ ] Security reviewed
- [ ] Accessibility checked
- [ ] Build optimized

---

**Status**: ✅ Frontend Complete - Ready for Backend Integration
**Version**: 1.0.0
**Build Size**: 226.67 KB (64.48 KB gzipped)
