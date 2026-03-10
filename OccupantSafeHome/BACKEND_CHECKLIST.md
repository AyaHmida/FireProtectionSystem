# SafeHome Backend - Implementation Checklist

## Project Setup
- [ ] Initialize Node.js project (npm/yarn)
- [ ] Set up Express.js server
- [ ] Configure database (MongoDB/PostgreSQL recommended)
- [ ] Set up authentication (JWT recommended)
- [ ] Configure CORS for frontend origin
- [ ] Set up environment variables

## Authentication Endpoints
- [ ] POST `/auth/login` - Authenticate user with email/password
- [ ] POST `/auth/register` - Create new user account
- [ ] POST `/auth/reset-password` - Send password reset email
- [ ] POST `/auth/confirm-reset` - Confirm password reset with token
- [ ] POST `/auth/refresh` - Refresh JWT token (optional)

## Dashboard Endpoints
- [ ] GET `/dashboard/stats` - Return: { zonesOk, activeAlerts, activeSensors, avgResponseTime }
- [ ] GET `/dashboard/recent-alerts` - Return array of recent alerts

## Zone Management
- [ ] GET `/zones` - List all zones
- [ ] GET `/zones/:id` - Get zone details
- [ ] PUT `/zones/:id` - Update zone configuration
- [ ] GET `/zones/:id/sensors` - Get sensors in zone

## Sensor Management
- [ ] GET `/sensors` - List all sensors
- [ ] GET `/sensors/:id` - Get sensor details with current readings
- [ ] POST `/sensors/:id/calibrate` - Calibrate sensor
- [ ] PUT `/sensors/:id/threshold` - Update sensor threshold

## Device Management
- [ ] GET `/devices` - List all devices
- [ ] GET `/devices/:id` - Get device details
- [ ] PUT `/devices/:id` - Update device status/settings
- [ ] DELETE `/devices/:id` - Remove device

## Alert Management
- [ ] GET `/alerts` - List all alerts (with filter: all/active/resolved)
- [ ] GET `/alerts/:id` - Get alert details
- [ ] PUT `/alerts/:id/resolve` - Mark alert as resolved
- [ ] DELETE `/alerts/:id` - Delete alert (admin only)
- [ ] POST `/alerts/acknowledge` - Acknowledge alert

## System Control
- [ ] GET `/system/state` - Get current system state
- [ ] PUT `/system/control` - Update system control state
- [ ] PUT `/system/toggle` - Toggle global on/off
- [ ] PUT `/system/zones/:id` - Toggle zone on/off
- [ ] POST `/system/alarm/stop` - Stop active alarm
- [ ] POST `/system/disable-temp` - Disable temporarily with duration
- [ ] GET `/system/log` - Get system event log

## Supervision & Real-time
- [ ] GET `/supervision/zones` - Get all zones for supervision
- [ ] GET `/supervision/zones/:id/sensors` - Get live sensor data for zone
- [ ] WebSocket `/ws/supervision` - Real-time sensor updates (recommended)
- [ ] WebSocket `/ws/alerts` - Real-time alert notifications

## Report & Analytics
- [ ] GET `/reports/alerts-stats` - Alert statistics (count by severity, type, etc.)
- [ ] GET `/reports/system` - System report (uptime, events, etc.)
- [ ] GET `/reports/history` - Historical data for date range
- [ ] GET `/reports/sensor-graph` - Sensor data for charts

## Contact Management
- [ ] GET `/contacts` - List all contacts
- [ ] GET `/contacts/:id` - Get contact details
- [ ] POST `/contacts` - Add new contact
- [ ] PUT `/contacts/:id` - Update contact
- [ ] DELETE `/contacts/:id` - Delete contact
- [ ] POST `/contacts/:id/test` - Test contact (call/message)

## Family & Community
- [ ] GET `/family/members` - List family members
- [ ] GET `/family/members/:id` - Get member details
- [ ] POST `/family/invite` - Send invite to member
- [ ] PUT `/family/members/:id` - Update member role/permissions
- [ ] DELETE `/family/members/:id` - Remove member access
- [ ] POST `/family/accept-invite` - Accept invitation with token
- [ ] GET `/family/invites` - List pending invites

## User Profile
- [ ] GET `/profile` - Get current user profile
- [ ] PUT `/profile` - Update profile (name, email, phone, address)
- [ ] POST `/profile/change-password` - Change password
- [ ] POST `/profile/avatar` - Upload avatar (multipart form)
- [ ] GET `/profile/export` - Export user data as JSON/CSV
- [ ] POST `/profile/delete-account` - Delete account (verify password)
- [ ] GET `/profile/sessions` - List active sessions
- [ ] POST `/profile/revoke-all-sessions` - Logout from all devices
- [ ] POST `/profile/sessions/:id/revoke` - Revoke specific session

## Settings & Configuration
- [ ] GET `/settings/thresholds` - Get alert thresholds
- [ ] PUT `/settings/thresholds` - Update thresholds (temp, gas, smoke levels)
- [ ] GET `/settings/notifications` - Get notification preferences
- [ ] PUT `/settings/notifications` - Update notifications (email, SMS, push)
- [ ] GET `/settings/advanced` - Advanced system settings
- [ ] PUT `/settings/advanced` - Update advanced settings

## Admin Features (if applicable)
- [ ] GET `/admin/users` - List all users
- [ ] GET `/admin/logs` - System logs
- [ ] GET `/admin/analytics` - System analytics
- [ ] POST `/admin/maintenance` - Trigger maintenance

## Database Schema Recommendations

### Users Table
```
- id (PK)
- name
- email (unique)
- phone
- address
- password (hashed)
- role (owner/member/observer)
- avatar_url
- created_at
- updated_at
- last_login
- is_active
```

### Zones Table
```
- id (PK)
- name
- user_id (FK)
- description
- is_active
- created_at
```

### Sensors Table
```
- id (PK)
- name
- type (smoke/gas/temperature)
- zone_id (FK)
- status (online/offline)
- battery_level
- current_value
- unit
- temperature_threshold
- gas_threshold
- smoke_threshold
- last_update
- created_at
```

### Alerts Table
```
- id (PK)
- user_id (FK)
- sensor_id (FK)
- zone_id (FK)
- type
- severity (critique/attention/normale)
- message
- value
- is_resolved
- resolved_reason
- created_at
- resolved_at
```

### Contacts Table
```
- id (PK)
- user_id (FK)
- name
- phone
- relation
- emoji
- is_emergency
- created_at
```

### Family Members Table
```
- id (PK)
- owner_id (FK)
- member_id (FK)
- access_level (owner/member/observer)
- status (active/pending)
- invite_token
- invite_expires_at
- joined_at
- created_at
```

## Security Checklist
- [ ] Implement JWT token validation on all protected endpoints
- [ ] Hash passwords using bcrypt or similar
- [ ] Validate all input data
- [ ] Implement rate limiting
- [ ] Add CORS headers properly
- [ ] Use HTTPS in production
- [ ] Implement request logging
- [ ] Add error handling and validation
- [ ] Secure sensitive endpoints (admin, user deletion)
- [ ] Implement email verification for password reset

## Deployment
- [ ] Set production environment variables
- [ ] Configure database for production
- [ ] Set up SSL certificates
- [ ] Configure logging service
- [ ] Set up monitoring/alerting
- [ ] Create backup strategy
- [ ] Document API for frontend team

## Testing
- [ ] Unit tests for services
- [ ] Integration tests for endpoints
- [ ] API load testing
- [ ] Security testing
- [ ] Email notification testing (if applicable)

## Documentation
- [ ] API documentation (Swagger/OpenAPI recommended)
- [ ] Database schema documentation
- [ ] Deployment guide
- [ ] Environment setup instructions
- [ ] Troubleshooting guide

## Estimated Timeline
- Project setup: 1-2 days
- Core authentication: 2-3 days
- Main CRUD endpoints: 3-5 days
- System & control logic: 5-7 days
- Real-time features: 3-5 days
- Testing & polishing: 3-5 days
- Deployment: 1-2 days

**Total: ~4-5 weeks for full backend development**
