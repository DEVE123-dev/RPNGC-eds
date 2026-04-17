![Project Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)

# RPNGC Emergency Dispatch System

A real-time emergency response and dispatch management system built for the Royal Papua New Guinea Constabulary (RPNGC). This web application enables citizens to request police assistance, officers to respond to incidents, and command centers to monitor operations in real-time.

## Overview

This system modernizes emergency response coordination by providing three distinct portals:

**Citizen Portal** - Public access for emergency requests
- Request police assistance with incident details (type, urgency, description)
- One-tap SOS emergency button for critical situations
- Real-time officer location tracking on map
- Two-way messaging with responding officer
- Live status updates (waiting, officer en route, resolved)

**Officer Portal** - Secure badge-based authentication for field officers
- Real-time incident queue showing all pending requests
- Accept/resolve incidents with resolution notes
- Availability status management (available, on break, offline)
- Live GPS location broadcasting
- Two-way messaging with citizens
- Multiple incident handling capability

**HQ Command Center** - Administrative oversight and analytics
- Real-time dashboard with incident statistics
- Live map showing all active incidents and officer locations
- Analytics: response times, incident breakdown by type/urgency
- Officer status monitoring and management
- Manual officer availability override
- Comprehensive incident reporting

**Admin Panel** - Officer management interface
- Full CRUD operations for officer accounts
- Manage officer profiles (badge, rank, station, credentials)
- Activate/deactivate officer accounts
- Bulk officer directory management

## Key Features

- **Real-time Communication**: Socket.io enables instant updates between citizens, officers, and HQ
- **Live GPS Tracking**: Officers broadcast location; citizens and HQ see movement in real-time
- **Incident Management**: Complete lifecycle from request → assignment → resolution
- **Role-based Access**: JWT authentication for officers and HQ administrators
- **Mobile-responsive UI**: Professional interface with RPNGC branding
- **Cloud Database**: MongoDB Atlas for scalable data storage
- **Interactive Maps**: Leaflet + OpenStreetMap for location visualization
- **Status Management**: Officers can toggle availability; HQ can override if needed
- **Messaging System**: In-incident chat between citizens and officers
- **Analytics Dashboard**: Response time tracking and incident pattern analysis

## Origin

Originally derived from an Uber-style dispatch architecture, this project was completely rebuilt and customized for emergency response operations in Papua New Guinea.


## Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![Node.JS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express.JS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) 

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the project root:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/rpngc?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-here
   PORT=8000
   ```

4. **Seed the database**
   
   Populate with sample officers and HQ admin:
   ```bash
   node db/seed.js
   ```

   This creates:
   - 3 sample officers (badges: RPNGC-001, RPNGC-002, RPNGC-003)
   - 1 HQ admin account (username: hq-admin)
   - Default password for all: `password123`

## Running the Application

Start the server:
```bash
node app.js
```

The application will be available at `http://localhost:8000`

## Usage

### Access Points

- **Landing Page**: `http://localhost:8000/`
- **Citizen Portal**: `http://localhost:8000/citizen.html`
- **Officer Portal**: `http://localhost:8000/officer.html`
- **HQ Command**: `http://localhost:8000/hq.html`
- **Admin Panel**: `http://localhost:8000/admin.html`

### Default Credentials

**Officers:**
- Badge: `RPNGC-001`, `RPNGC-002`, or `RPNGC-003`
- Password: `password123`

**HQ Admin:**
- Username: `hq-admin`
- Password: `hqpassword123`

**Citizens:**
- No login required (anonymous access)

## How to Use the Application

### For Citizens (Public Users)

1. **Access the Citizen Portal**
   - Navigate to `http://localhost:8000/`
   - Click on the "Citizen Portal" card
   - Or go directly to `http://localhost:8000/citizen.html`

2. **Request Police Assistance**
   - The map will automatically center on your location (allow browser location access)
   - Fill in the request form:
     - **Phone Number**: Enter your contact number (required)
     - **Incident Type**: Select from dropdown (theft, assault, accident, disturbance, other)
     - **Urgency Level**: Choose low, medium, high, or critical
     - **Description**: Brief description of the situation (optional)
   - Click "Request Officer" for normal requests
   - Click "SOS - EMERGENCY" for critical situations requiring immediate response

3. **Wait for Officer Response**
   - Your request is broadcast to all available officers
   - You'll see a "Waiting for officer..." notification
   - The map shows your location with a red marker

4. **Officer Accepts Your Request**
   - You'll receive a notification showing which officer is responding
   - Officer details displayed: name, badge number, ETA
   - A blue marker appears on the map showing the officer's location
   - The officer's location updates in real-time as they approach
   - Chat messaging becomes available

5. **Communicate with Officer**
   - Use the chat panel to send messages to the responding officer
   - Messages appear in real-time
   - Your messages are right-aligned (blue background)
   - Officer messages are left-aligned (gray background)

6. **Incident Resolution**
   - When the officer marks the incident as resolved, you'll see a success notification
   - The page will automatically refresh after 3 seconds
   - You can submit a new request if needed

### For Officers (Field Personnel)

1. **Login to Officer Portal**
   - Navigate to `http://localhost:8000/officer.html`
   - Enter your badge number (e.g., `RPNGC-001`)
   - Enter your password (default: `password123`)
   - Click "Login"

2. **Initial Setup**
   - Upon login, you're automatically set to "Available" status
   - Your GPS location is tracked and broadcast in real-time
   - The map centers on your current location
   - Your profile shows: name, badge, rank, station

3. **Manage Your Availability**
   - Use the status dropdown to change your availability:
     - **Available**: Ready to accept new incidents
     - **On Break**: Temporarily unavailable
     - **Offline**: Not accepting any requests
   - Only "Available" officers receive incident alerts

4. **Receive Incident Alerts**
   - When a citizen requests help, it appears in your "Incident Queue"
   - Pending incidents show:
     - Incident type and urgency level
     - Brief description
     - SOS flag if it's an emergency
   - Multiple incidents can queue up

5. **Accept an Incident**
   - Click on any incident in the queue to accept it
   - Your status automatically changes to "Busy"
   - The incident moves to "Active Incident" section
   - Citizen is notified that you're responding
   - A red marker shows the incident location on the map
   - Chat messaging becomes available

6. **Navigate to Incident**
   - Use the map to see the incident location (red marker)
   - Your location (blue marker) updates as you move
   - Citizen can see your location in real-time

7. **Communicate with Citizen**
   - Use the chat panel to message the citizen
   - Ask for additional details or provide updates
   - Messages are instant and bidirectional

8. **Resolve the Incident**
   - Click "Mark Resolved" when the incident is handled
   - Enter resolution notes when prompted (optional)
   - Your status automatically returns to "Available"
   - You can immediately accept new incidents
   - No need to logout/login again

9. **Handle Multiple Incidents**
   - After resolving one incident, new requests appear in your queue
   - Accept the next incident when ready
   - Stay logged in for your entire shift

### For HQ Command (Supervisors)

1. **Login to HQ Command Center**
   - Navigate to `http://localhost:8000/hq.html`
   - Enter username: `hq-admin`
   - Enter password: `hqpassword123`
   - Click "Login"

2. **Dashboard Overview**
   - Top statistics show:
     - **Waiting**: Incidents awaiting officer assignment
     - **Engaged**: Incidents currently being handled
     - **Resolved**: Completed incidents
     - **Total**: All incidents in the system
   - Map displays all active incidents (red markers) and officers (blue markers)
   - Real-time updates as incidents are created, accepted, and resolved

3. **Incidents Tab**
   - View all active incidents in a list
   - Each incident shows:
     - Type and urgency level
     - Location address
     - Status (waiting/engaged/resolved)
     - Citizen phone number
     - SOS flag if emergency
   - Click incident markers on map to see details in popup

4. **Officers Tab**
   - View all registered officers
   - Each officer shows:
     - Name, badge number, rank
     - Assigned station
     - Current status (available/busy/break/offline)
   - **Free Up Officers**: If an officer is stuck in "Busy" status, click "Set Available" to manually free them

5. **Analytics Tab**
   - **Average Response Time**: Shows how long it takes officers to respond (in minutes)
   - **Incidents by Type**: Bar chart showing breakdown (theft, assault, accident, etc.)
   - **Incidents by Urgency**: Bar chart showing distribution (low, medium, high, critical)
   - Use this data to identify patterns and optimize resource allocation

6. **Real-time Monitoring**
   - Officer locations update live on the map as they move
   - New incidents appear instantly
   - Status changes reflect immediately
   - All connected clients stay synchronized

7. **Access Admin Panel**
   - Click "Manage Officers" in the header
   - Opens the officer management interface

### For Administrators (Officer Management)

1. **Access Admin Panel**
   - From HQ dashboard, click "Manage Officers"
   - Or navigate directly to `http://localhost:8000/admin.html`

2. **View Officer Directory**
   - Table shows all officers with:
     - Badge number, name, rank
     - Station assignment
     - Phone number
     - Active/Inactive status

3. **Add New Officer**
   - Click "+ Add Officer" button
   - Fill in the form:
     - **User ID**: Unique identifier (e.g., officer-004)
     - **Badge Number**: Official badge (e.g., RPNGC-004)
     - **Display Name**: Full name
     - **Rank**: Select from dropdown (Constable, Sergeant, Inspector, etc.)
     - **Station**: Assigned police station
     - **Phone**: Contact number
     - **Email**: Official email address
     - **Password**: Initial login password
   - Click "Save"
   - Officer can now login with their badge number and password

4. **Edit Existing Officer**
   - Click "Edit" button next to any officer
   - Modify any field except User ID
   - Leave password blank to keep current password
   - Enter new password to change it
   - Click "Save"

5. **Deactivate Officer**
   - Click "Deactivate" button next to any officer
   - Confirm the action
   - Officer status changes to "Inactive"
   - They can no longer login
   - Use this for officers who leave the force or are suspended

6. **Reactivate Officer**
   - Edit the officer's profile
   - Change status back to "Active"
   - They can login again

## Common Workflows

### Scenario 1: Emergency Response

1. Citizen clicks "SOS - EMERGENCY" button
2. Request marked as critical and broadcast to all available officers
3. First officer to accept gets assigned
4. Officer navigates to location using live map
5. Officer and citizen communicate via chat
6. Officer resolves incident and adds notes
7. System logs resolution time for analytics

### Scenario 2: Multiple Incidents

1. Multiple citizens submit requests simultaneously
2. All available officers see all pending incidents in their queue
3. Officers accept incidents based on proximity or urgency
4. Each officer handles their assigned incident
5. Upon resolution, officers become available for next incident
6. HQ monitors all activity on central dashboard

### Scenario 3: Officer Management

1. HQ admin needs to add new officer
2. Admin opens officer management panel
3. Creates new officer profile with credentials
4. New officer receives badge number and password
5. Officer logs in and becomes available for dispatch
6. HQ can monitor officer's status and activity

### Scenario 4: Stuck Officer Status

1. Officer accepts incident but closes browser accidentally
2. Officer remains "Busy" in database
3. Officer cannot receive new incidents
4. HQ supervisor notices officer stuck in "Busy" status
5. HQ clicks "Set Available" button for that officer
6. Officer can now login and receive new incidents

## Troubleshooting

### Citizens Not Receiving Officer Notifications

- Ensure browser allows location access
- Check that you entered a valid phone number
- Verify at least one officer is logged in and "Available"
- Check browser console for errors

### Officers Not Receiving Incident Alerts

- Verify your status is set to "Available" (not "Break" or "Offline")
- Check internet connection
- Ensure you're logged in (check if profile shows in sidebar)
- Try logging out and back in

### Map Not Loading

- Check internet connection (maps require online access)
- Verify browser allows location access
- Clear browser cache and reload page
- Check browser console for JavaScript errors

### Database Connection Issues

- Verify MongoDB Atlas connection string in `.env` file
- Check that IP address is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for testing)
- Ensure database user has read/write permissions
- Test connection by running `node db/seed.js`

### Authentication Failures

- Verify credentials match seeded data
- Check that JWT_SECRET is set in `.env` file
- Clear browser localStorage and try again
- Re-run seed script to reset passwords

### Real-time Updates Not Working

- Check that Socket.io is connected (browser console should show connection)
- Verify server is running without errors
- Check firewall isn't blocking WebSocket connections
- Try refreshing the page

## API Endpoints

### Authentication
- `POST /auth/officer/login` - Officer login with badge and password
- `POST /auth/hq/login` - HQ admin login with username and password

### Officers
- `GET /officers/nearby?lat=X&lng=Y` - Get nearby available officers
- `GET /officers/info?userId=X` - Get officer details
- `GET /officers/all` - Get all officers (HQ only)
- `POST /officers/status` - Update officer availability status

### Incidents
- `GET /incidents/pending` - Get all waiting incidents
- `GET /incidents/stats` - Get incident statistics (HQ only)
- `GET /incidents/report` - Get incident analytics (HQ only)
- `GET /incidents` - Get all incidents with filters (HQ only)
- `GET /incidents/:id/messages` - Get messages for an incident

### Admin
- `GET /admin/officers` - List all officers (HQ only)
- `POST /admin/officers` - Create new officer (HQ only)
- `PUT /admin/officers/:userId` - Update officer (HQ only)
- `DELETE /admin/officers/:userId` - Deactivate officer (HQ only)

### Socket.io Events

**Client to Server:**
- `join` - Join socket room with userId and role
- `request-assistance` - Citizen requests help
- `incident-accepted` - Officer accepts incident
- `incident-closed` - Officer/HQ closes incident
- `location-update` - Officer broadcasts GPS location
- `officer-status` - Officer changes availability
- `send-message` - Send chat message

**Server to Client:**
- `request-assistance` - New incident alert to officers
- `incident-accepted` - Officer accepted (to citizen)
- `incident-closed` - Incident resolved notification
- `incident-update` - Status change (to HQ)
- `officer-location` - Officer location update (to HQ)
- `officer-status-update` - Officer status change (to HQ)
- `new-message` - New chat message

## Security Considerations

### Production Deployment

Before deploying to production:

1. **Change Default Passwords**
   - Update all officer passwords from `password123`
   - Change HQ admin password from `hqpassword123`
   - Use strong, unique passwords

2. **Secure Environment Variables**
   - Never commit `.env` file to version control
   - Use strong JWT_SECRET (minimum 32 characters)
   - Rotate secrets regularly

3. **Database Security**
   - Restrict MongoDB Atlas IP whitelist to your server IP
   - Use strong database password
   - Enable MongoDB encryption at rest
   - Regular backups

4. **HTTPS/SSL**
   - Deploy behind HTTPS (required for geolocation)
   - Use valid SSL certificates
   - Redirect HTTP to HTTPS

5. **Rate Limiting**
   - Implement rate limiting on API endpoints
   - Prevent brute force login attempts
   - Throttle incident creation

6. **Input Validation**
   - Validate all user inputs server-side
   - Sanitize data before database insertion
   - Prevent SQL/NoSQL injection

7. **Session Management**
   - Set appropriate JWT expiration times
   - Implement token refresh mechanism
   - Clear tokens on logout

## Performance Optimization

### For High Traffic

1. **Database Indexing**
   - Index frequently queried fields (userId, badgeNumber, status)
   - Geospatial index on location coordinates
   - Compound indexes for complex queries

2. **Caching**
   - Cache officer lists in memory
   - Use Redis for session storage
   - Cache static assets with CDN

3. **Load Balancing**
   - Use multiple server instances
   - Sticky sessions for Socket.io
   - Horizontal scaling with PM2 or Kubernetes

4. **Connection Pooling**
   - Configure MongoDB connection pool size
   - Reuse database connections
   - Monitor connection limits

## Future Enhancements

Potential features for future development:

- Mobile apps (iOS/Android) for officers and citizens
- SMS notifications for citizens without smartphones
- Voice call integration for critical incidents
- Automated officer dispatch based on proximity and availability
- Incident priority queue with AI-based routing
- Body camera integration and evidence management
- Shift scheduling and roster management
- Performance metrics and officer ratings
- Multi-language support (Tok Pisin, Hiri Motu, English)
- Offline mode with sync when connection restored
- Integration with national crime database
- Predictive analytics for crime hotspots
- Public incident map (anonymized data)



## Project Structure

```
├── app.js                 # Express server setup
├── routes.js              # API endpoints
├── socket-events.js       # Real-time Socket.io handlers
├── middleware/
│   └── auth.js           # JWT authentication
├── db/
│   ├── data-model.js     # MongoDB schemas
│   ├── db-operations.js  # Database queries
│   └── seed.js           # Database seeding script
├── views/
│   ├── index.html        # Landing page
│   ├── citizen.html      # Citizen portal
│   ├── officer.html      # Officer portal
│   ├── hq.html          # HQ command center
│   └── admin.html       # Admin panel
└── public/
    ├── css/
    │   └── rpngc.css    # RPNGC branded styles
    └── images/          # Logos and icons
```

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (cloud)
- **Real-time**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Maps**: Leaflet.js + OpenStreetMap
- **Security**: bcrypt for password hashing

## Features in Detail

### Real-time Updates
- Officers receive incident alerts instantly when citizens request help
- Citizens see officer location updates as they approach
- HQ monitors all activity on live dashboard
- Status changes propagate immediately across all connected clients

### Incident Lifecycle
1. Citizen submits request with location, type, urgency
2. System broadcasts to all available officers
3. First officer to accept gets assigned
4. Officer status changes to "busy"
5. Two-way messaging enabled
6. Officer marks incident resolved with notes
7. Officer becomes available for next request

### Security
- Officers and HQ require authentication
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for session management
- Role-based access control (officer vs HQ)
- Citizens remain anonymous for privacy

-----

Made with dedication for emergency response operations.
