# SafeHome Frontend - Backend Integration Guide

## Overview
This is a complete React + TypeScript frontend for the SafeHome smart home security system. All pages, components, and services are ready to connect to a backend API.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main app layout with Sidebar + Topbar
│   ├── Sidebar.tsx     # Navigation menu
│   ├── Topbar.tsx      # Header with notifications and logout
│   ├── StatusCard.tsx  # Stat display cards
│   ├── AlertBox.tsx    # Alert notifications
│   └── DeviceCard.tsx  # Device display cards
├── pages/              # Page components
│   ├── Login.tsx       # Authentication
│   ├── Register.tsx    # User registration
│   ├── ResetPassword.tsx # Password recovery
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Devices.tsx     # Device management
│   ├── Supervision.tsx # Real-time monitoring
│   ├── Alerts.tsx      # Alert management
│   ├── Reports.tsx     # Analytics & reports
│   ├── Control.tsx     # System control
│   ├── Contacts.tsx    # Emergency contacts
│   ├── Family.tsx      # Family management
│   ├── Profile.tsx     # User profile
│   ├── Settings.tsx    # Configuration
│   └── NotFound.tsx    # 404 page
├── services/           # API integration layer
│   ├── apiClient.ts    # Base HTTP client
│   ├── authService.ts  # Authentication API
│   ├── systemService.ts # System & monitoring API
│   ├── communityService.ts # Contacts & family API
│   ├── userService.ts  # User & settings API
│   └── index.ts        # Service exports
├── types/              # TypeScript interfaces
│   └── index.ts        # All type definitions
├── App.tsx             # Main router
├── main.tsx            # React entry point
└── index.css           # Global styles
```

## Environment Setup

1. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

2. Update the API URL to match your backend:
```env
VITE_API_URL=http://your-backend-url/api
```

## API Services

### Authentication Service (`authService.ts`)
Handles all authentication operations:
- `login(credentials)` - Login with email/password
- `register(data)` - Register new account
- `resetPassword(email)` - Request password reset
- `logout()` - Clear session
- `isAuthenticated()` - Check if user is logged in

### System Service (`systemService.ts`)
Manages monitoring and control:
- Dashboard stats and alerts
- Zone monitoring
- Sensor data
- Device management
- Alert management
- System control (on/off, zone toggles)
- Temporary disable with duration/reason
- Supervision and real-time data

### Community Service (`communityService.ts`)
Handles contacts and family:
- Emergency contacts (CRUD)
- Test contact calls
- Family member management
- Invitations
- Access control

### User Service (`userService.ts`)
Manages user profile and settings:
- Profile update
- Password change
- Avatar upload
- Threshold settings
- Notification preferences
- Data export
- Session management

### API Client (`apiClient.ts`)
Base HTTP client with:
- Automatic Authorization header injection
- 401 error handling (redirect to login)
- Request/response formatting
- GET, POST, PUT, DELETE methods

## Backend Integration Points

### Required Endpoints

#### Authentication (`/auth`)
```
POST   /auth/login           - Login
POST   /auth/register        - Register
POST   /auth/reset-password  - Reset password
```

#### Dashboard (`/dashboard`)
```
GET    /dashboard/stats      - Get dashboard statistics
GET    /dashboard/recent-alerts - Get recent alerts
```

#### Zones (`/zones`)
```
GET    /zones                - List all zones
GET    /zones/:id            - Get zone details
PUT    /zones/:id            - Update zone
GET    /zones/:id/sensors    - Get zone sensors
```

#### Sensors (`/sensors`)
```
GET    /sensors              - List all sensors
GET    /sensors/:id          - Get sensor details
```

#### Devices (`/devices`)
```
GET    /devices              - List all devices
GET    /devices/:id          - Get device details
PUT    /devices/:id          - Toggle device
```

#### Alerts (`/alerts`)
```
GET    /alerts               - List alerts (with filter query)
GET    /alerts/:id           - Get alert details
PUT    /alerts/:id/resolve   - Resolve alert
```

#### System Control (`/system`)
```
GET    /system/state         - Get system state
PUT    /system/control       - Update system
PUT    /system/toggle        - Toggle global switch
PUT    /system/zones/:id     - Toggle zone
POST   /system/alarm/stop    - Stop alarm
POST   /system/disable-temp  - Set temporary disable
GET    /supervision/zones    - Get supervised zones
GET    /supervision/zones/:id/sensors - Get zone sensor data
```

#### Reports (`/reports`)
```
GET    /reports/alerts-stats - Alert statistics
GET    /reports/system       - System report
GET    /reports/history      - Historical data
```

#### Contacts (`/contacts`)
```
GET    /contacts             - List contacts
GET    /contacts/:id         - Get contact
POST   /contacts             - Add contact
PUT    /contacts/:id         - Update contact
DELETE /contacts/:id         - Delete contact
POST   /contacts/:id/test    - Test contact
```

#### Family (`/family`)
```
GET    /family/members       - List family members
GET    /family/members/:id   - Get member details
POST   /family/invite        - Invite member
PUT    /family/members/:id   - Update member role
DELETE /family/members/:id   - Remove member
POST   /family/accept-invite - Accept invitation
```

#### Profile (`/profile`)
```
GET    /profile              - Get user profile
PUT    /profile              - Update profile
POST   /profile/change-password - Change password
POST   /profile/avatar       - Upload avatar
GET    /profile/export       - Export data
POST   /profile/delete-account - Delete account
GET    /profile/sessions     - Get active sessions
POST   /profile/revoke-all-sessions - Revoke all sessions
POST   /profile/sessions/:id/revoke - Revoke session
```

#### Settings (`/settings`)
```
GET    /settings/thresholds  - Get threshold settings
PUT    /settings/thresholds  - Update thresholds
GET    /settings/notifications - Get notification prefs
PUT    /settings/notifications - Update notification prefs
```

## Response Format

All API responses should follow this format:

```typescript
{
  "success": boolean,
  "data": T,              // The actual data
  "error": string,        // Error message (if error)
  "message": string       // Additional message
}
```

### Example Response
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "123",
      "name": "Ahmed Ben Salah",
      "email": "ahmed@example.com",
      "role": "owner"
    }
  }
}
```

## Authentication Flow

1. User submits login credentials
2. Frontend calls `POST /auth/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. All subsequent requests include `Authorization: Bearer <token>`
6. On 401 response, frontend clears token and redirects to `/login`

## Deployment

### Production Build
```bash
npm run build
```

Output: `dist/` directory ready for deployment

### Environment Variables
- `VITE_API_URL` - Backend API base URL

## Features Implemented

### Pages
- ✅ Login / Register / Password Reset
- ✅ Dashboard with real-time stats
- ✅ Device management
- ✅ System supervision with sensor data
- ✅ Alert management with filtering
- ✅ System control (on/off, zone toggles)
- ✅ Emergency contacts
- ✅ Family member management
- ✅ User profile
- ✅ Settings & configuration

### Layout
- ✅ Responsive sidebar with scrollbar
- ✅ Sticky topbar with notifications
- ✅ Logout functionality
- ✅ Active page highlighting
- ✅ Badge notifications

### UI/UX
- ✅ Dark theme with custom colors
- ✅ Smooth animations
- ✅ Modal dialogs for actions
- ✅ Form validation ready
- ✅ Tab navigation
- ✅ Status badges and indicators

## Next Steps for Backend Team

1. Create database schema based on types in `src/types/index.ts`
2. Implement authentication endpoints
3. Create system monitoring API
4. Set up real-time updates (WebSocket recommended)
5. Implement email notifications
6. Add device management API
7. Create alert processing system
8. Set up data persistence

## Support

All service calls are properly typed with TypeScript. Check `src/types/index.ts` for detailed type definitions.

Frontend is production-ready and only requires backend API to function.
